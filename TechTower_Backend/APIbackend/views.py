from datetime import datetime
import os
import json

from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.conf import settings
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken

from google import genai
from google.genai.errors import APIError

import mercadopago

from .models import Producto, Carrito, ItemCarrito, Producto
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer, ProductSerializer, CarritoSerializer, ItemCarritoSerializer

from .validations import custom_validation # No es util

'''
    NOTAS:
    Cambiar el sistema de autenticación a token-based en el futuro.
    Por ahora, se usa session-based auth para simplicidad.

    Se agregó el uso de JWT tokens para autenticación.
    Pero no se quitó el sistema de session-based auth.

    Añadir QueryParameters para filtrar productos por categoría, marca, etc.
    Puede ser útil para el frontend.
'''

def get_csrf_token(request):
    token = get_token(request)  # Obtén el token CSRF
    return JsonResponse({'csrfToken': token})

# Cualquiera puede acceder al registro
class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(request.data)
        # Validations.py es donde se pueden agregar validaciones personalizadas. Pero no es util
        # clean_data = custom_validation(request.data)
        # clean_data = request.data
        serializer = UserRegisterSerializer(data=request.data)
        # Una vez que el usuario haya creado y pasado todas las comprobaciones
        # el metodo serializer creará un nuevo usuario
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(serializer.validated_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

def is_staff_user(user):
    return user.is_staff

class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        print("Datos recibidos en el backend:", request.data) # Depuración
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            email = data.get('email')
            password = data.get('password')
            # Usamos authenticate con el email como username
            user = authenticate(request, username=email, password=password)
            if user is not None:
                # Generar tokens para el usuario autenticado
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                
                return Response({
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'refresh': str(refresh),
                    'access': access_token,
                    'message': "Login exitoso"
                }, status=status.HTTP_200_OK)
            return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Metodo post para ejectutar el logout

# No desloguea
class UserLogout(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# Muestra datos correctamente. No obstante, también se puede obtener desde el token JWT, por que un usuario deslogeado puede ver los datos.
class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class ProductCreate(APIView):
    # permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden crear productos (is_staff=True)
    permission_classes = [permissions.AllowAny] # Depuración

    def post(self, request):
        print(request.data)
        # clean_data = custom_product(request.data)
        serializer = ProductSerializer(data=request.data)
        data = request.data
        if serializer.is_valid(raise_exception=True):
            producto = serializer.create(data)
            # producto.save() # Redundante si ya se guarda en el método create
            if producto:
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
      
class ProductList(ListAPIView):
    permission_classes = [permissions.AllowAny] # Cualquiera puede ver la lista de productos    
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer

# Detalle de un producto específico
class ProductDetail(RetrieveAPIView):
    permission_classes = [permissions.AllowAny] # Cualquiera puede ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'producto_id'

class ProductUpdate(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'producto_id'

    def perform_update(self, serializer):
        # Lógica adicional
        serializer.save()

class ProductDelete(DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'producto_id'

# ================= Carrito de Compras ==================
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_or_create_cart(self, user):
        """ Obtiene el carrito del usuario o crea uno si no existe. """
        cart, created = Carrito.objects.get_or_create(usuario=user)
        return cart

    def get(self, request):
        """ Ver el contenido del carrito. """
        cart = self.get_or_create_cart(request.user)
        serializer = CarritoSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """ Añadir un producto al carrito. """
        cart = self.get_or_create_cart(request.user)
        producto_id = request.data.get('producto')
        cantidad = request.data.get('cantidad', 1)

        try:
            producto = Producto.objects.get(producto_id=producto_id)
        except Producto.DoesNotExist:
            return Response({"error": "El producto no existe."}, status=status.HTTP_404_NOT_FOUND)

        item, created = ItemCarrito.objects.get_or_create(
            carrito=cart,
            producto=producto,
            defaults={'cantidad': cantidad}
        )

        if not created:
            item.cantidad += cantidad
            item.save()

        serializer = CarritoSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """ Actualizar la cantidad de un producto en el carrito. """
        cart = self.get_or_create_cart(request.user)
        item_id = request.data.get('item_id')
        cantidad = request.data.get('cantidad')

        if not item_id or cantidad is None:
            return Response({"error": "Se requiere 'item_id' y 'cantidad'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = ItemCarrito.objects.get(id=item_id, carrito=cart)
        except ItemCarrito.DoesNotExist:
            return Response({"error": "El ítem no existe en este carrito."}, status=status.HTTP_404_NOT_FOUND)

        if cantidad <= 0:
            item.delete()
            return Response({"message": "Producto eliminado del carrito."}, status=status.HTTP_200_OK)
        
        item.cantidad = cantidad
        item.save()

        serializer = CarritoSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        """ Eliminar un producto del carrito. """
        cart = self.get_or_create_cart(request.user)
        item_id = request.data.get('item_id')

        if not item_id:
            return Response({"error": "Se requiere el ID del ítem a eliminar."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = ItemCarrito.objects.get(id=item_id, carrito=cart)
            item.delete()
            return Response({"message": "Producto eliminado del carrito."}, status=status.HTTP_200_OK)
        except ItemCarrito.DoesNotExist:
            return Response({"error": "El ítem no existe en este carrito."}, status=status.HTTP_404_NOT_FOUND)
        
# ================== Google GenAI ==================

# **¡Para producción, SE DEBE usar el método seguro de Django!**
class AsistenteIAViewCompatible(APIView):

    def post(self, request):
        try:
            # Traer ID del Frontend
            componente_ids = request.data.get('ids', [])

            if not componente_ids:
                return Response({"error": "No se proporcionaron IDs de componentes."}, status=400)

            # Consulta DB
            productos_seleccionados = Producto.objects.filter(producto_id__in=componente_ids)

            # Lista de strings con los detalles relevantes
            # Evitar enviar datos sensibles
            datos_para_ia = []
            for p in productos_seleccionados:
                datos_para_ia.append(
                    f"Componente: {p.nombre_producto}, Stock: {p.stock_producto}, Marca: {p.marca_producto}, Precio Tradicional: {p.precio_otro}, Precio Transferencia: {p.precio_transferencia}"
                )
            
            datos_contexto = "\n".join(datos_para_ia)

            # Prompt base, sujeto a cambios. Lo ideal es que el usuario envie el prompt entero.
            prompt = (
                "Eres un experto en hardware, revisa la siguiente lista de componentes y evalúa su compatibilidad. "
                "Si hay incompatibilidad, explica el motivo (ej: socket, potencia, o cuello de botella). " \
                "Evita sobre extenderte, y da una solución"
                "Lista de Componentes:\n"
                f"--- INICIO DATOS DB ---\n{datos_contexto}\n--- FIN DATOS DB ---\n"
            )

            # Llamada a la API
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )

            # Recojer la respuesta
            return Response({"respuesta_ia": response.text})

        except Producto.DoesNotExist:
             return Response({"error": "Uno o más IDs de productos no fueron encontrados."}, status=404)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=500)
            
class AsistenteIAViewPresupuesto(APIView):

    def post(self, request):
        if request.method != 'POST':
            return JsonResponse({'error': 'Solo se acepta método POST'}, status=405)

        try:
            # Obtener datos del usuario
            data = json.loads(request.body)
            presupuesto = data.get('presupuesto')
            perfil_uso = data.get('perfil', 'uso general') # Si el usuario no lo define, se asume

            if not presupuesto or not isinstance(presupuesto, (int, float)):
                return JsonResponse({'error': 'Debe especificar un presupuesto válido'}, status=400)

            # consulta a la base de datos 
            datos_productos = list(Producto.objects.all().values())
            
            # Formato del Prompt!
            # "El System Prompt define el rol y las reglas de la IA"
            system_prompt = (
                "Eres un experto en armado de PC y asistente de la tienda Techtower. "
                "Tu misión es seleccionar la MEJOR configuración de componentes posible "
                "que se ajuste al presupuesto del cliente y su perfil de uso. "
                "El presupuesto máximo es ${:,.0f} CLP. El uso principal es: {}. "
                "Solo debes usar los productos listados en el JSON. "
                "Tu respuesta DEBE ser un objeto JSON con dos claves: 'seleccion_final' (una lista de los IDs de los productos elegidos) y 'justificacion' (un párrafo explicando el por qué de la elección, mencionando el equilibrio precio/rendimiento)."
                .format(presupuesto, perfil_uso)
            )
            
            # El User Prompt le da los datos para trabajar
            user_prompt = "Lista de productos disponibles: \n" + json.dumps(datos_productos, indent=2)

            # Preparar la llamada a la IA (Descomentar para usar)
            api_key = os.environ.get('API_KEY_IA')

            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
               model='gemini-2.5-flash',
               contents=[system_prompt, user_prompt]
            )
            
            texto_ia = response.text
            # Quitar el envoltorio de markdown 
            if texto_ia.startswith("```json"):
                texto_limpio = texto_ia.replace("```json\n", "").replace("\n```", "").strip()
            else:
                texto_limpio = texto_ia

            # Convertir el string limpio en un objeto Python
                try:
                    resultado_ia_json = json.loads(texto_limpio)
                except json.JSONDecodeError:
                    # Si la IA no devolvió un JSON válido, manejamos el error
                    resultado_ia_json = {"error": "La IA no devolvió un formato JSON válido.", "raw_text": texto_ia}

            # Devolver la respuesta al frontend
            return JsonResponse({
                'status': 'success',
                'resultado_ia': resultado_ia_json
            })
        
        

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Payload JSON inválido'}, status=400)
        except APIError as e:
            return JsonResponse({'error': f'Error de la API de IA: {str(e)}'}, status=500)
        except Exception as e:
            return JsonResponse({'error': f'Un error inesperado ocurrió: {str(e)}'}, status=500)
        
# ================== MercadoPago ==================

sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN) 

class CrearPreferenciaMP(APIView):
    def post(self, request):
        try:
            data = request.data
            # items_carrito = data.get('items', [])

            carrito_id = data.get('carrito_id')
            
            if not carrito_id:
                return JsonResponse({'error': 'No se encontró la id del carrito.'}, status=400)

            # items_mp_format = items_carrito # Depuración: usar los datos tal cual vienen del frontend

            items_carrito_db = ItemCarrito.objects.filter(carrito__id=carrito_id)

            if not items_carrito_db.exists():
                return JsonResponse({'error': 'El carrito está vacío o no existe.'}, status=400)
            
            # 1. Mapeo de ítems y consulta a la DB
            items_mp_format = []
            for item in items_carrito_db:
                producto = item.producto # Asume que ItemCarrito tiene una FK a Producto
                
                # Mapeamos los datos de la DB al formato {title, quantity, unit_price}
                items_mp_format.append({
                    "title": getattr(producto, 'nombre_producto', 'Producto Genérico'),
                    "quantity": item.cantidad, # Asume que ItemCarrito tiene el campo 'cantidad'
                    # Usamos el precio que prefieras de tu modelo
                    "unit_price": float(getattr(producto, 'precio_transferencia', 0)) 
                })

            # 2. Definición de la URL de base
            base_url = "http://localhost:5173/" # El dominio de React
            
            URL_NGROK_BASE = "https://unpatented-jerald-darlingly.ngrok-free.dev"

            # 3. Creación del objeto de preferencia

            external_reference_id = f"ORDER-{carrito_id}-{datetime.now().timestamp()}"
            preference_data = {
                "items": items_mp_format,
                "external_reference": external_reference_id,
                "back_urls": {
                    "success": f"{base_url}http://localhost:5173//pago/exito", 
                    "failure": f"{base_url}http://localhost:5173//pago/fallo",
                    "pending": f"{base_url}http://localhost:5173//pago/pendiente"
                },
                #"auto_return": "approved",
                "notification_url": f"{URL_NGROK_BASE}/api/mp/webhook" # Usar http/https sin duplicar
            }
            
            # 4. LLAMADA AL SDK (AQUÍ DEBE IR DESPUÉS DE LA DEFINICIÓN)
            preference_response = sdk.preference().create(preference_data)

            print("Respuesta Completa de MP:", preference_response) # Depuración completa!

            if 'status' in preference_response and preference_response['status'] >= 400:
                # Si es un error de API, el mensaje real estará DENTRO de la clave 'response'
                error_details = preference_response.get('response', {})
                
                # Intenta obtener el mensaje de error directamente desde la respuesta interna
                error_message = error_details.get('message', 'Error desconocido de Mercado Pago (Revisar logs).')
                
                # Devuelve un error más claro y el código de estado HTTP 400
                return JsonResponse({"error": f"Error de Mercado Pago (Status {preference_response['status']}): {error_message}"}, status=400)
                        
            preference = preference_response["response"]
            
            # Devolver el punto de inicio de pago al frontend (React)
            return JsonResponse({"init_point": preference["init_point"]})
        
        except Carrito.DoesNotExist:
            return JsonResponse({'error': f'El carrito {carrito_id} no existe.'}, status=404)
        except Exception as e: # Captura errores del SDK o de conexión
            # Imprime el error en la terminal
            print(f"ERROR MP SDK: {str(e)}") 
            # Devuelve una respuesta 500 al cliente con el mensaje de error
            return JsonResponse({"error": f"Error al crear la preferencia. {str(e)}"}, status=500)

@csrf_exempt
def webhook_mp(request):
    # El token CSRF debe ser ignorado porque la llamada no viene de un navegador
    if request.method == 'POST':
        try:
            # MP envía una notificación POST con los datos de la transacción
            data = json.loads(request.body)
            
            # 1. OBTENER EL ID DEL PAGO
            # Ejemplo: data = {'id': '12345', 'topic': 'payment', 'resource': '...'}
            topic = data.get('topic')
            resource_id = data.get('id')
            
            if topic == 'payment' and resource_id:
                # 2. CONSULTAR A MP PARA OBTENER EL ESTADO REAL
                payment_info = sdk.payment().get(resource_id)
                payment_status = payment_info['response']['status']
                external_reference = payment_info['response']['external_reference'] # ID de tu orden
                
                # 3. ACTUALIZAR LA BASE DE DATOS
                if payment_status == 'approved':
                    # Lógica para marcar tu orden como PAGADA en la DB
                    print(f"Pago APROBADO para la orden: {external_reference}")
                elif payment_status in ('pending', 'in_process'):
                    # Lógica para marcar la orden como PENDIENTE
                    print(f"Pago PENDIENTE para la orden: {external_reference}")
                else: # rejected, cancelled, etc.
                    # Lógica para marcar la orden como FALLIDA
                    print(f"Pago RECHAZADO para la orden: {external_reference}")

                # 4. RESPONDER CON 200 OK
                # ¡Es CRÍTICO que la respuesta sea 200 para que MP no reintente!
                return HttpResponse(status=200)

        except Exception as e:
            print(f"Error procesando Webhook: {str(e)}")
            return HttpResponse(status=500)
    
    return HttpResponse(status=405) # Método no permitido