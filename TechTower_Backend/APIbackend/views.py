import os
import json
import traceback

from django.contrib.auth import authenticate, login, get_user_model, login, logout
from django.db.models import F, Sum, Count
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.conf import settings
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.db.models.functions import TruncMonth

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import permissions, status, filters
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from google import genai
import google.generativeai as generativeai
from google.genai.errors import APIError
from google.api_core import exceptions as google_exceptions

from .models import Producto, Carrito, ItemCarrito, Producto, Orden, OrdenProducto, Pago, Categoria, TipoProducto
from .serializers import (
    UserLoginSerializer,
    UserRegisterSerializer,
    UserSerializer,
    ProductSerializer,
    CarritoSerializer,
    ItemCarritoSerializer,
    OrdenSerializer,
    OrdenProductoSimpleSerializer,
    UserProfileUpdateSerializer,
    CategoriaSerializer,
    TipoProductoSerializer
)

from .validations import custom_validation # No es util

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
        serializer = UserProfileUpdateSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """
        Actualiza el perfil del usuario logeado.
        """
        user_instance = request.user 
        
        serializer = UserProfileUpdateSerializer(
            instance=user_instance, 
            data=request.data,      
            partial=True            
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """
        Elimina la cuenta del usuario actual después de verificar la contraseña.
        """
        user = request.user
        password = request.data.get('password')

        if not password:
            return Response(
                {"error": "Se requiere la contraseña para eliminar la cuenta."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificamos que la contraseña sea correcta
        if not check_password(password, user.password):
            return Response(
                {"error": "La contraseña es incorrecta."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Si la contraseña es correcta, procedemos a eliminar el usuario
        try:
            user.delete()
            return Response(
                {"message": "Tu cuenta ha sido eliminada permanentemente."}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": f"Hubo un error al eliminar la cuenta: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ============ Vistas de Productos =============
class ProductCreate(APIView):
    # permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden crear productos (is_staff=True)
    permission_classes = [permissions.AllowAny] # Depuración

    def post(self, request):
        print(request.data)
        # clean_data = custom_product(request.data)
        serializer = ProductSerializer(data=request.data)
        # data = request.data
        if serializer.is_valid(raise_exception=True):
            # producto = serializer.create(data)
            # producto.save() # Redundante si ya se guarda en el método create
            producto = serializer.save()
            if producto:
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
      
class ProductList(ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    
    # filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    # filterset_fields = ['categoria__nombre_categoria']

    # search_fields = ['nombre_producto', 'marca_producto', 'descripcion_producto']

    def get_queryset(self):
        queryset = Producto.objects.all()
        
        categoria_nombre = self.request.query_params.get('categoria', None)
        if categoria_nombre is not None:
            queryset = queryset.filter(categoria__nombre_categoria__iexact=categoria_nombre)

        search_query = self.request.query_params.get('search', None)
        if search_query is not None:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(nombre_producto__icontains=search_query) |
                Q(marca_producto__icontains=search_query) |
                Q(descripcion_producto__icontains=search_query)
            )

        destacado_param = self.request.query_params.get('destacado', None)
        if destacado_param is not None:
            valor_booleano = destacado_param.lower() == 'true'
            queryset = queryset.filter(es_destacado=valor_booleano)

        en_oferta = self.request.query_params.get('en_oferta', None)
        if en_oferta is not None:
            # Si ?en_oferta=true, filtramos donde 'descuento' sea mayor a 0
            if en_oferta.lower() == 'true':
                queryset = queryset.filter(descuento__gt=0)

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
        """ Añadir un producto al carrito (CON VALIDACIÓN DE STOCK). """
        cart = self.get_or_create_cart(request.user)
        producto_id = request.data.get('producto')
        cantidad = request.data.get('cantidad', 1)

        try:
            producto = Producto.objects.get(producto_id=producto_id)
        except Producto.DoesNotExist:
            return Response({"error": "El producto no existe."}, status=status.HTTP_404_NOT_FOUND)

        if cantidad > producto.stock_producto:
            return Response({"error": f"Stock insuficiente. Solo quedan {producto.stock_producto} unidades."}, status=status.HTTP_400_BAD_REQUEST)

        item, created = ItemCarrito.objects.get_or_create(
            carrito=cart,
            producto=producto,
            defaults={'cantidad': cantidad}
        )

        if not created:
            nueva_cantidad = item.cantidad + cantidad
            if nueva_cantidad > producto.stock_producto:
                return Response({"error": f"Stock insuficiente. Ya tienes {item.cantidad} y solo quedan {producto.stock_producto}."}, status=status.HTTP_400_BAD_REQUEST)
            
            item.cantidad = nueva_cantidad
            item.save()

        serializer = CarritoSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """ Actualizar la cantidad (CON VALIDACIÓN DE STOCK). """
        cart = self.get_or_create_cart(request.user)
        item_id = request.data.get('item_id')
        cantidad = request.data.get('cantidad')
        
        try:
            item = ItemCarrito.objects.get(id=item_id, carrito=cart)
        except ItemCarrito.DoesNotExist:
            return Response({"error": "El ítem no existe en este carrito."}, status=status.HTTP_404_NOT_FOUND)

        if cantidad > item.producto.stock_producto:
             return Response({"error": f"Stock insuficiente. Solo quedan {item.producto.stock_producto} unidades."}, status=status.HTTP_400_BAD_REQUEST)

        if cantidad <= 0:
            item.delete()
            # (No necesitas serializar aquí, solo devolver la confirmación)
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

# ================== VISTAS DE ÓRDENES ==================
class MisOrdenesListView(ListAPIView):
    """
    Endpoint para el CLIENTE.
    Devuelve solo las órdenes del usuario que está logeado.
    """
    permission_classes = [IsAuthenticated] # Solo usuarios logeados
    serializer_class = OrdenSerializer

    def get_queryset(self):
        """ Filtra el queryset para devolver solo las del usuario actual. """
        # Filtramos donde 'usuario_orden' (el campo en el modelo Orden)
        # sea igual a 'request.user' (el usuario del token)
        return Orden.objects.filter(usuario_orden=self.request.user).order_by('-fecha_orden')

class AdminOrdenListView(ListAPIView):
    """
    Endpoint para el EMPLEADO (Panel de Órdenes).
    Devuelve TODAS las órdenes de TODOS los usuarios.
    """
    permission_classes = [IsAdminUser] # Solo usuarios con 'is_staff=True'
    serializer_class = OrdenSerializer
    
    def get_queryset(self):
        """ Devuelve todas las órdenes, ordenadas por fecha """
        return Orden.objects.all().order_by('-fecha_orden')
        
# ================== Google GenAI ==================

# **¡Para producción, SE DEBE usar el método seguro de Django!**
# También hay que intentar eliminar los comentariso de depuración
class AsistenteIAViewCompatible(APIView):

    def post(self, request):
        try:
            componente_ids = request.data.get('ids', [])

            if not componente_ids:
                return Response({"error": "No se proporcionaron IDs de componentes."}, status=400)

            productos_seleccionados = Producto.objects.filter(producto_id__in=componente_ids)

            datos_para_ia = []
            for p in productos_seleccionados:
                datos_para_ia.append(
                    f"Componente: {p.nombre_producto}, Stock: {p.stock_producto}, Marca: {p.marca_producto}, Precio Tradicional: {p.precio_otro}, Precio Transferencia: {p.precio_transferencia}"
                )
            
            datos_contexto = "\n".join(datos_para_ia)

            try:
                prompt = (
                    "Eres un experto en hardware, revisa la siguiente lista de componentes y evalúa su compatibilidad. "
                    "Si hay incompatibilidad, explica el motivo (ej: socket, potencia, o cuello de botella). " \
                    "Evita sobre extenderte, y da una solución"
                    "Lista de Componentes:\n"
                    f"--- INICIO DATOS DB ---\n{datos_contexto}\n--- FIN DATOS DB ---\n"
                )

                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )

                return Response({"respuesta_ia": response.text})
            except google_exceptions.ResourceExhausted as e:
                print(f"Cuota excedida: {e}")
                return Response(
                    {"error": "La IA está saturada por muchas peticiones. Por favor, espera 10 segundos e intenta de nuevo."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )
            except Exception as e:
                # Captura genérica para otros errores
                print(f"Error inesperado: {e}")
                return Response(
                    {"error": "Ocurrió un error interno al procesar la solicitud."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )    

        except Producto.DoesNotExist:
             return Response({"error": "Uno o más IDs de productos no fueron encontrados."}, status=404)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=500)
            
class AsistenteIAViewPresupuesto(APIView):

    def post(self, request):
        if request.method != 'POST':
            return JsonResponse({'error': 'Solo se acepta método POST'}, status=405)

        try:
            data = json.loads(request.body)
            presupuesto = data.get('presupuesto')
            perfil_uso = data.get('perfil', 'uso general')

            if not presupuesto or not isinstance(presupuesto, (int, float)):
                return JsonResponse({'error': 'Debe especificar un presupuesto válido'}, status=400)

            productos_qs = Producto.objects.all()
            datos_para_ia = []
            for p in productos_qs:
                tipo_nombre = "No especificado"
                if p.tipo:
                    tipo_nombre = p.tipo.nombre_tipo
                
                datos_para_ia.append(
                    f"ID: {p.producto_id}, Nombre: {p.nombre_producto}, Marca: {p.marca_producto}, "
                    f"Precio: {p.precio_transferencia}, Tipo: {tipo_nombre}"
                )
            
            # lista_productos_str = "\n".join(datos_para_ia)

            user_prompt = "Lista de productos disponibles: \n" + "\n".join(datos_para_ia)
            
            # full_prompt = f"""
            #     Eres un experto en armado de PC y asistente de la tienda Techtower.
            #     Tu misión es seleccionar la MEJOR configuración de componentes posible que se ajuste al siguiente presupuesto y perfil:

            #     - Presupuesto Máximo: ${presupuesto:,.0f} CLP
            #     - Perfil de Uso: {perfil_uso}

            #     Aquí está la lista de productos disponibles de la tienda (solo puedes usar estos productos):
            #     --- INICIO LISTA DE PRODUCTOS ---
            #     {lista_productos_str}
            #     --- FIN LISTA DE PRODUCTOS ---

            #     Tu respuesta DEBE ser un objeto JSON (y nada más que el JSON) con dos claves:
            #     1. "seleccion_final": una lista de los IDs (solo los números de ID) de los productos que elegiste.
            #     2. "justificacion": un párrafo explicando el por qué de tu elección, mencionando el equilibrio precio/rendimiento.
            #     """

            system_prompt = (
                "Eres un experto en armado de PC y asistente de la tienda Techtower. "
                "Tu misión es seleccionar la MEJOR configuración de componentes posible "
                "que se ajuste al presupuesto de ${:,.0f} CLP y perfil de uso '{}'. "
                "Usa SOLO los productos de la lista. "
                "Escribe un párrafo de justificación explicando por qué elegiste esos componentes (mencionando sus IDs) y el equilibrio precio/rendimiento."
                .format(presupuesto, perfil_uso)
            )

            api_key = settings.GEMINI_API_KEY
            if not api_key:
                 return JsonResponse({'error': 'API Key no configurada.'}, status=500)

            generativeai.configure(api_key=api_key)
            # config = genai.GenerationConfig(response_mime_type="application/json")
            model = generativeai.GenerativeModel('gemini-2.5-flash') #, generation_config=config
            response = model.generate_content([system_prompt, user_prompt])
            
            # texto_ia = response.text
            # if texto_ia.startswith("```json"):
            #     texto_limpio = texto_ia.replace("```json\n", "").replace("\n```", "").strip()
            # else:
            #     texto_limpio = texto_ia
            #     try:
            #         resultado_ia_json = json.loads(texto_limpio)
            #     except json.JSONDecodeError:
            #         resultado_ia_json = {"error": "La IA no devolvió un formato JSON válido.", "raw_text": texto_ia}

            # Devolver la respuesta al frontend
            return JsonResponse({
                'status': 'success',
                'resultado_ia': response.text #resultado_ia_json
            })
        
        

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Payload JSON inválido'}, status=400)
        except APIError as e:
            return JsonResponse({'error': f'Error de la API de IA: {str(e)}'}, status=500)
        except Exception as e:
            print("\n--- ERROR INTERNO DETALLADO (AsistenteIAViewPresupuesto) ---")
            traceback.print_exc()
            print("----------------------------------------------------------\n")

            error_message = f"Error inesperado: {str(e)} (Revisa el log de Django para el traceback completo)"
            return JsonResponse({'error': error_message}, status=500)
        
# ================== LÓGICA DE CHECKOUT ====================
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Crea una nueva Orden a partir del Carrito del usuario.
        Se asume que esta vista es llamada DESPUÉS de una simulación
        de pago exitosa en el frontend.
        """
        try:
            # Aquí se obtiene el carrito y los items del mismo...
            cart = Carrito.objects.get(usuario=request.user)
            items = ItemCarrito.objects.filter(carrito=cart)

            if not items.exists():
                return Response({"error": "Tu carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

            # IMPORTANTE! AQUÏ SE RE-VALIDA STOCK Y "CALCULAR TOTAL"
            total = 0
            for item in items:
                if item.cantidad > item.producto.stock_producto:
                    return Response({"error": f"Stock insuficiente para {item.producto.nombre_producto}. Solo quedan {item.producto.stock_producto}."}, status=status.HTTP_400_BAD_REQUEST)
                # Usamos el precio de transferencia (Solo de ejemplo, ya que no se puede elegir)
                total += item.producto.precio_final_transferencia * item.cantidad

            # Se crea el pedido
            new_order = Orden.objects.create(
                usuario_orden=request.user,
                estado_orden='aprobado', # Siempre será aprobatorio...
                total_orden=total,
                fecha_orden=timezone.now()
            )

            # Los items del carrito, a la "orden"
            for item in items:
                OrdenProducto.objects.create(
                    orden=new_order,
                    producto=item.producto,
                    cantidad=item.cantidad
                )
                
                # Se actualiza el stock
                producto_actual = item.producto
                producto_actual.stock_producto -= item.cantidad
                producto_actual.save()
                # Nota: debería mostrarse los datos de los items incluso cuando este sin stock. NO ELIMINARSE
                # Eso último no pasa, pero solo queda aplicar lógica para que NO pueda hacerse compras SIN STOCK

            # Mockup de pago. Algun día estará conectado a Mercado Pago
            Pago.objects.create(
                orden=new_order,  # Vincula el pago a la orden recién creada
                metodo_pago="Tarjeta Débito", # Opción hardcodeada para este mock!!
                monto_pago=new_order.total_orden # Usamos el total de la orden
                # fecha_pago se añade automáticamente por auto_now_add=True
                # Por que lo de arriba está comentado? No sé, ahi reviso. 10-11-2025
            )

            # Chaolin el carrito 
            items.delete()

            serializer = OrdenSerializer(new_order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Carrito.DoesNotExist:
            return Response({"error": "No se encontró un carrito para este usuario."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Un error inesperado ocurrió: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# ================== Vistas para Dropdowns ==================

class CategoriaListView(ListAPIView):
    """ Devuelve una lista de todas las categorías (ID y Nombre) """
    permission_classes = [permissions.AllowAny]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class TipoProductoListView(ListAPIView):
    """ Devuelve una lista de todos los Tipos de Producto (ID y Nombre) """
    permission_classes = [permissions.AllowAny]
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer

# ================== Dashboard de datos ==================

class DashboardSalesByCategoryView(APIView):
    """
    Devuelve el total de ventas (aprobadas) agrupado por categoría.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Solo ordenes aprobadas
        try:
            year = int(request.query_params.get('year', timezone.now().year))
        except ValueError:
            return Response({"error": "Año inválido"}, status=400)

        sales_data = OrdenProducto.objects.filter(
                # Filtro de estado y año
                orden__estado_orden='aprobado',
                orden__fecha_orden__year=year
            ) \
            .values('producto__categoria__nombre_categoria') \
            .annotate(
                # Se sumama el precio del producto * la cantidad vendida
                total_vendido=Sum(F('producto__precio_transferencia') * F('cantidad'))
            ) \
            .order_by('-total_vendido')

        data_para_frontend = [
            {'label': item['producto__categoria__nombre_categoria'], 'value': item['total_vendido']} 
            for item in sales_data if item['total_vendido'] > 0
        ]
        
        return Response(data_para_frontend, status=status.HTTP_200_OK)


class DashboardSalesByMonthView(APIView):
    """
    Devuelve el total de ventas (aprobadas) agrupado por mes.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            year = int(request.query_params.get('year', timezone.now().year))
        except ValueError:
            return Response({"error": "Año inválido"}, status=400)

        sales_data = Orden.objects.filter(
                estado_orden='aprobado',
                fecha_orden__year=year
            ) \
            .annotate(mes=TruncMonth('fecha_orden')) \
            .values('mes') \
            .annotate(total_ventas=Sum('total_orden')) \
            .order_by('mes')

        data_para_frontend = [
            {'label': item['mes'].strftime('%B'), 'value': item['total_ventas']} # Mostramos solo el mes
            for item in sales_data
        ]

        return Response(data_para_frontend, status=status.HTTP_200_OK)

class DashboardTopProductsView(APIView):
    """
    Devuelve los 5 productos más vendidos, basado en ingresos.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            year = int(request.query_params.get('year', timezone.now().year))
        except ValueError:
            return Response({"error": "Año inválido"}, status=400)

        # Usamos el modelo Producto como base
        top_products = Producto.objects.filter(
                # Filtramos por productos que aparecen en órdenes aprobadas de ese año
                ordenproducto__orden__estado_orden='aprobado',
                ordenproducto__orden__fecha_orden__year=year
            ) \
            .annotate(
                # Calculamos los ingresos totales para CADA producto
                ingresos_totales=Sum(F('ordenproducto__cantidad') * F('precio_transferencia'))
            ) \
            .order_by('-ingresos_totales')[:5] # Ordenamos y tomamos los 5 primeros

        data_para_frontend = [
            {'label': p.nombre_producto, 'value': p.ingresos_totales}
            for p in top_products if p.ingresos_totales > 0
        ]
        
        return Response(data_para_frontend, status=status.HTTP_200_OK)  

# # ================== Ia EME ====================
# # Configura la API de Gemini con tu clave
# try:
#     genai.configure(api_key=settings.GEMINI_API_KEY)
# except AttributeError:
#     # Manejo de error si la clave no está configurada
#     print("ADVERTENCIA: GEMINI_API_KEY no está configurada. El Chatbot no funcionará.")


# class ChatbotAPIView(APIView):
#     """
#     Endpoint de API para el chatbot de Gemini.
#     """
    
#     # Configuración del modelo (ajusta 'gemini-pro' si usas otro)
#     model = genai.GenerativeModel(
#         'gemini-pro',
#         # ¡Clave! Forzamos a Gemini a responder en formato JSON
#         generation_config={"response_mime_type": "application/json"}
#     )
    
#     # El historial del chat se mantiene en memoria del servidor
#     # Para producción, deberías guardar esto en la sesión del usuario o DB
#     if 'chat_history' not in globals():
#         global chat_history
#         chat_history = []

#     def post(self, request, *args, **kwargs):
#         user_message = request.data.get('message')
#         if not user_message:
#             return Response({"error": "No se proporcionó ningún mensaje."}, status=status.HTTP_400_BAD_REQUEST)

#         # 🧠 ¡El Prompt Engineering es clave!
#         # Aquí le das la personalidad, instrucciones y el formato de salida.
#         system_prompt = """
#         Eres "Peki", un asistente virtual experto en hardware para la tienda "TechTower".
#         Tu objetivo es ayudar a los usuarios a armar una PC según sus necesidades (gaming, diseño, oficina).
        
#         Debes responder SIEMPRE en formato JSON. El JSON debe tener la siguiente estructura:
#         {
#           "text": "Tu respuesta amable y conversacional aquí.",
#           "action": "null | setComponent",
#           "payload": {
#             "type": "cpu | motherboard | gpu | ram | ssd | psu",
#             "id": "ID_DEL_PRODUCTO (ej: 'cpu1', 'gpu2')"
#           }
#         }
        
#         - "text" es la respuesta que verá el usuario.
#         - "action" es la acción que el frontend debe ejecutar.
#         - Si recomiendas un componente específico, usa "action": "setComponent" y llena el "payload" con el tipo y el ID del producto.
#         - Si solo estás saludando o respondiendo una pregunta general, usa "action": "null".
        
#         Ejemplo de conversación:
#         Usuario: "Quiero una PC para gaming"
#         Tu JSON: {
#           "text": "¡Entendido! Para gaming te recomiendo empezar con un buen procesador. Te he seleccionado un AMD Ryzen 7 7800X3D.",
#           "action": "setComponent",
#           "payload": { "type": "cpu", "id": "cpu3" }
#         }
        
#         Usuario: "Gracias"
#         Tu JSON: {
#           "text": "¿Hay algo más en lo que te pueda ayudar?",
#           "action": "null",
#           "payload": null
#         }
        
#         Aquí está el historial de la conversación:
#         """
        
#         # Preparamos el mensaje para la IA
#         full_prompt = system_prompt + "\n".join(self.chat_history) + "\nUsuario: " + user_message

#         try:
#             # Envía el prompt a Gemini
#             response = self.model.generate_content(full_prompt)
            
#             # Añade el turno actual al historial
#             self.chat_history.append("Usuario: " + user_message)
#             self.chat_history.append("IA: " + response.text)
            
#             # Decodifica la respuesta JSON de Gemini
#             bot_response_json = json.loads(response.text)
            
#             # Devuelve el JSON a React
#             return Response(bot_response_json, status=status.HTTP_200_OK)

#         except Exception as e:
#             # Manejo de errores de la API de Gemini
#             return Response({"error": f"Error al contactar la IA: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)