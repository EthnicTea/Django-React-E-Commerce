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
from django.shortcuts import redirect
from django.shortcuts import redirect, get_object_or_404
from .models import Orden, OrdenProducto, Pago
from django.db import transaction
from django.contrib.auth.decorators import login_required

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
sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

def create_preference_from_db(request, orden_id):
    """
    Crea la preferencia de pago usando datos de una Orden (Orden.models) de la BD.
    """
    
    # 1. Recuperar la Orden de la Base de Datos
    # Usamos el ID correcto: orden_id
    # ¡Importante! Asegúrate de que solo el dueño de la orden pueda acceder a ella.
    order = get_object_or_404(Orden, orden_id=orden_id, usuario_orden=request.user) 
    
    # 2. Construir la lista de ítems para Mercado Pago
    mp_items = []
    
    # Usamos el modelo intermedio OrdenProducto (la tabla 'through') para obtener 
    # todos los ítems de esa orden específica.
    order_items = OrdenProducto.objects.filter(orden=order)
    
    for item in order_items:
        # Nota: Usaremos el precio_transferencia como precio base, ya que es IntegerField
        # Mercado Pago requiere floats o enteros. Usaremos float() para asegurar.
        unit_price = float(item.producto.precio_transferencia)
        
        mp_items.append({
            "title": item.producto.nombre_producto, 
            "quantity": int(item.cantidad), # Cantidad del producto en la orden
            "currency_id": "CLP", # Ajusta esto a tu moneda (ARS, CLP, MXN, etc.)
            "unit_price": unit_price
        })
        
    # VALIDACIÓN: Si no hay ítems, no podemos crear la preferencia
    if not mp_items:
        return HttpResponse("Error: La orden no contiene productos.", status=400)
        
    # 3. Definición del objeto de la preferencia
    preference_data = {
        "items": mp_items,
        
        # ID Externo: CRUCIAL para el Webhook. Usamos el ID de tu orden.
        "external_reference": str(order.orden_id), 
        
        # Información del Comprador (Recomendado)
        # Se rellena con los datos que tienes en UsuarioApp
        "payer": {
            "email": order.usuario_orden.email,
            "name": order.usuario_orden.nombre or "",
            "surname": order.usuario_orden.apellido or "",
        },
        
        # 4. URLs de retorno y Notificación (Webhooks)
        "back_urls": {
            "success": "http://127.0.0.1:8000/payments/success",
            "pending": "http://127.0.0.1:8000/payments/pending",
            "failure": "http://127.0.0.1:8000/payments/failure",
        },
        "notification_url": "https://tudominiodeejemplo.com/api/webhooks/mercadopago", 
        "auto_return": "all"
    }

    # 5. Envía la solicitud a la API de Mercado Pago y Redirige
    try:
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        
        checkout_url = preference["sandbox_init_point"] 
        return redirect(checkout_url)

    except Exception as e:
        return HttpResponse(f"Error al crear la preferencia MP: {e}", status=500)
    
@login_required
@transaction.atomic # Asegura que si algo falla, no se crea la Orden incompleta
def checkout_create_order(request):
    """
    Paso 1: Mueve los ítems del Carrito del usuario a una nueva Orden y calcula el total.
    """
    # 1. Obtener el carrito activo del usuario logeado
    try:
        cart = Carrito.objects.get(usuario=request.user, activo=True)
        cart_items = cart.items.select_related('producto')
    except Carrito.DoesNotExist:
        # Si no hay carrito, redirigir a una página de carrito vacío
        return redirect('cart_empty_url') 

    if not cart_items.exists():
        # Si el carrito está vacío, no se puede crear la orden
        return redirect('cart_empty_url') 

    # 2. Calcular el total y la lista de ítems para la nueva orden
    total_order = 0
    
    # 3. Crear el objeto Orden inicial (estado 'Pendiente')
    new_order = Orden.objects.create(
        usuario_orden=request.user,
        estado_orden='Pendiente' # Estado inicial antes del pago
        # total_orden se actualizará más abajo
    )
    
    # 4. Mover los ítems: Crear objetos OrdenProducto
    order_products_list = []
    
    for item in cart_items:
        # Crea el ítem de la orden (congelando el precio y cantidad)
        order_product = OrdenProducto(
            orden=new_order,
            producto=item.producto,
            cantidad=item.cantidad
            # Nota: Si el precio es de un IntegerField, recuerda usar el campo correcto:
            # subtotal_item = item.cantidad * item.producto.precio_transferencia 
        )
        total_order += item.subtotal() # Usamos la función subtotal de tu modelo ItemCarrito
        order_products_list.append(order_product)

    # Inserción masiva de los ítems de la orden para eficiencia
    OrdenProducto.objects.bulk_create(order_products_list)

    # 5. Actualizar el total de la orden
    new_order.total_orden = total_order
    new_order.save()
    
    # 6. Vaciar el carrito después de mover los ítems a la orden
    cart.vaciar()
    
    # 7. Redirigir a la vista de Mercado Pago con el ID de la ORDEN creada
    # Ahora tenemos el orden_id que la vista de pago necesita
    return redirect('create_preference', orden_id=new_order.orden_id)

@csrf_exempt # Desactiva la protección CSRF ya que es una comunicación de servidor a servidor
def mercadopago_webhook(request):
    # 1. Validación inicial: Solo aceptar método POST
    if request.method != 'POST':
        return HttpResponse(status=405) # Method Not Allowed
        
    # Mercado Pago envía parámetros por URL (GET) o cuerpo (POST)
    # A menudo, envían el tipo de notificación por GET: ?type=payment&data.id=12345
    # Aquí asumimos que el endpoint está configurado para la API de Notificaciones
    
    try:
        data = request.GET 
        topic = data.get('topic') or data.get('type')
        resource_id = data.get('id') or data.get('data.id')
        
        # Validar que se reciban los datos esenciales
        if not topic or not resource_id:
            # Si no hay topic/id, igual se devuelve 200 para que MP no reintente.
            # Pero podemos loguear que algo salió mal.
            return HttpResponse(status=200)

        # Solo nos interesa el topic 'payment' para la confirmación de la orden
        if topic == 'payment':
            # 2. Obtener el Pago completo desde la API de MP (seguridad)
            payment_response = sdk.payment().get(resource_id)
            payment = payment_response['response']

            # 3. Obtener el external_reference y el estado
            external_reference = payment.get('external_reference')
            payment_status = payment.get('status')
            payment_id = payment.get('id')
            
            # --- Proceso de Actualización de la DB ---
            # 4. Encontrar la Orden en tu DB usando la external_reference
            try:
                # La external_reference es el orden_id de tu modelo
                order = get_object_or_404(Orden, orden_id=external_reference)
            except Exception:
                # Si la orden no existe, loguear y responder 200 para evitar reintentos.
                return HttpResponse(status=200)

            # 5. Actualizar la Orden y crear el registro de Pago
            with transaction.atomic():
                if payment_status == 'approved':
                    order.estado_orden = 'Pagado'
                    # Aquí deberías implementar la LÓGICA DE DESCONTAR EL STOCK (Inventario)
                elif payment_status == 'pending':
                    order.estado_orden = 'Pendiente MP' # En espera de la confirmación
                else: # Incluye 'rejected', 'cancelled', etc.
                    order.estado_orden = 'Fallida'
                
                order.save()
                
                # Crear o actualizar el registro en la tabla Pago
                # Usamos update_or_create para manejar reintentos de notificaciones
                Pago.objects.update_or_create(
                    orden=order,
                    defaults={
                        'payment_id': payment_id,
                        'metodo_pago': payment.get('payment_type_id'),
                        'monto_pago': payment.get('transaction_amount'),
                        'status': payment_status
                        # preference_id se puede añadir si lo recuperas de la orden
                    }
                )
        
    except Exception as e:
        # En caso de error interno, loguear la excepción y devolver 200 para no reintentar
        # Si devuelve un 5xx, MP intentará notificar de nuevo por 48 horas.
        # Por seguridad, ante fallos internos, es mejor devolver 200 y revisar logs.
        print(f"Error procesando webhook MP: {e}") 
        return HttpResponse(status=200)

    # 6. Respuesta final: Siempre devolver HTTP 200 OK para confirmar la recepción a MP
    return HttpResponse(status=200)
    
# sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN) 

# class CrearPreferenciaMP(APIView):
#     def post(self, request):
#         try:
#             data = request.data
#             # items_carrito = data.get('items', [])

#             carrito_id = data.get('carrito_id')
            
#             if not carrito_id:
#                 return JsonResponse({'error': 'No se encontró la id del carrito.'}, status=400)

#             # items_mp_format = items_carrito # Depuración: usar los datos tal cual vienen del frontend

#             items_carrito_db = ItemCarrito.objects.filter(carrito__id=carrito_id)

#             if not items_carrito_db.exists():
#                 return JsonResponse({'error': 'El carrito está vacío o no existe.'}, status=400)
            
#             # 1. Mapeo de ítems y consulta a la DB
#             items_mp_format = []
#             for item in items_carrito_db:
#                 producto = item.producto # Asume que ItemCarrito tiene una FK a Producto
                
#                 # Mapeamos los datos de la DB al formato {title, quantity, unit_price}
#                 items_mp_format.append({
#                     "title": getattr(producto, 'nombre_producto', 'Producto Genérico'),
#                     "quantity": item.cantidad, # Asume que ItemCarrito tiene el campo 'cantidad'
#                     # Usamos el precio que prefieras de tu modelo
#                     "unit_price": float(getattr(producto, 'precio_transferencia', 0)) 
#                 })

#             # 2. Definición de la URL de base
#             base_url = "http://localhost:5173/" # El dominio de React
            
#             URL_NGROK_BASE = "https://unpatented-jerald-darlingly.ngrok-free.dev"

#             # 3. Creación del objeto de preferencia

#             external_reference_id = f"ORDER-{carrito_id}-{datetime.now().timestamp()}"
#             preference_data = {
#                 "items": items_mp_format,
#                 "external_reference": external_reference_id,
#                 "back_urls": {
#                     "success": f"{base_url}http://localhost:5173//pago/exito", 
#                     "failure": f"{base_url}http://localhost:5173//pago/fallo",
#                     "pending": f"{base_url}http://localhost:5173//pago/pendiente"
#                 },
#                 #"auto_return": "approved",
#                 "notification_url": f"{URL_NGROK_BASE}/api/mp/webhook" # Usar http/https sin duplicar
#             }
            
#             # 4. LLAMADA AL SDK (AQUÍ DEBE IR DESPUÉS DE LA DEFINICIÓN)
#             preference_response = sdk.preference().create(preference_data)

#             print("Respuesta Completa de MP:", preference_response) # Depuración completa!

#             if 'status' in preference_response and preference_response['status'] >= 400:
#                 # Si es un error de API, el mensaje real estará DENTRO de la clave 'response'
#                 error_details = preference_response.get('response', {})
                
#                 # Intenta obtener el mensaje de error directamente desde la respuesta interna
#                 error_message = error_details.get('message', 'Error desconocido de Mercado Pago (Revisar logs).')
                
#                 # Devuelve un error más claro y el código de estado HTTP 400
#                 return JsonResponse({"error": f"Error de Mercado Pago (Status {preference_response['status']}): {error_message}"}, status=400)
                        
#             preference = preference_response["response"]
            
#             # Devolver el punto de inicio de pago al frontend (React)
#             return JsonResponse({"init_point": preference["init_point"]})
        
#         except Carrito.DoesNotExist:
#             return JsonResponse({'error': f'El carrito {carrito_id} no existe.'}, status=404)
#         except Exception as e: # Captura errores del SDK o de conexión
#             # Imprime el error en la terminal
#             print(f"ERROR MP SDK: {str(e)}") 
#             # Devuelve una respuesta 500 al cliente con el mensaje de error
#             return JsonResponse({"error": f"Error al crear la preferencia. {str(e)}"}, status=500)

# @csrf_exempt
# def webhook_mp(request):
#     # El token CSRF debe ser ignorado porque la llamada no viene de un navegador
#     if request.method == 'POST':
#         try:
#             # MP envía una notificación POST con los datos de la transacción
#             data = json.loads(request.body)
            
#             # 1. OBTENER EL ID DEL PAGO
#             # Ejemplo: data = {'id': '12345', 'topic': 'payment', 'resource': '...'}
#             topic = data.get('topic')
#             resource_id = data.get('id')
            
#             if topic == 'payment' and resource_id:
#                 # 2. CONSULTAR A MP PARA OBTENER EL ESTADO REAL
#                 payment_info = sdk.payment().get(resource_id)
#                 payment_status = payment_info['response']['status']
#                 external_reference = payment_info['response']['external_reference'] # ID de tu orden
                
#                 # 3. ACTUALIZAR LA BASE DE DATOS
#                 if payment_status == 'approved':
#                     # Lógica para marcar tu orden como PAGADA en la DB
#                     print(f"Pago APROBADO para la orden: {external_reference}")
#                 elif payment_status in ('pending', 'in_process'):
#                     # Lógica para marcar la orden como PENDIENTE
#                     print(f"Pago PENDIENTE para la orden: {external_reference}")
#                 else: # rejected, cancelled, etc.
#                     # Lógica para marcar la orden como FALLIDA
#                     print(f"Pago RECHAZADO para la orden: {external_reference}")

#                 # 4. RESPONDER CON 200 OK
#                 # ¡Es CRÍTICO que la respuesta sea 200 para que MP no reintente!
#                 return HttpResponse(status=200)

#         except Exception as e:
#             print(f"Error procesando Webhook: {str(e)}")
#             return HttpResponse(status=500)
    
#     return HttpResponse(status=405) # Método no permitido