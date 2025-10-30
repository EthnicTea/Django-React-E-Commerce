import os
import json

from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.conf import settings
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken

from google import genai
from google.genai.errors import APIError

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
    
    def get_queryset(self):
        queryset = Producto.objects.all()
        
        categoria_nombre = self.request.query_params.get('categoria', None)
        
        if categoria_nombre is not None:
            queryset = queryset.filter(categoria__nombre_categoria__iexact=categoria_nombre)
            
        return queryset

# Detalle de un producto específico
class ProductDetail(RetrieveAPIView):
    permission_classes = [permissions.AllowAny] # Cualquiera puede ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'producto_id'

class ProductDetailUpdateDelete(RetrieveUpdateDestroyAPIView): # El nombre es largo pero claro
    permission_classes = [permissions.AllowAny] # [IsAdminUser]
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'producto_id'

# Vista para creación masiva de productos (via JSON  y solo para testing)
class ProductBulkCreate(APIView):
    permission_classes = [permissions.AllowAny] # Solo testing, comentar esta vista en producción

    def post(self, request, *args, **kwargs):
        products_data = request.data
        
        if not isinstance(products_data, list):
            return Response({"error": "Los datos deben ser una lista"}, status=status.HTTP_400_BAD_REQUEST)

        created_products = []
        errors = []

        # Ciclo en el diccionario de productos
        for product_data in products_data:
            serializer = ProductSerializer(data=product_data)
            
            if serializer.is_valid():
                try:
                    product_instance = serializer.save() 
                    created_products.append(serializer.data)
                except Exception as e:
                    errors.append({
                        "input_data": product_data,
                        "error": str(e)
                    })
            else:
                # Si falla...
                errors.append({
                    "input_data": product_data, 
                    "error": serializer.errors
                })
        # Depuración!
        if errors:
            return Response({
                "message": f"Completed with errors. {len(created_products)} products created.",
                "created": created_products,
                "errors": errors
            }, status=status.HTTP_207_MULTI_STATUS)

        # Si todo resulta...
        return Response({
            "message": f"Successfully created {len(created_products)} products.",
            "created": created_products
        }, status=status.HTTP_201_CREATED) 

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