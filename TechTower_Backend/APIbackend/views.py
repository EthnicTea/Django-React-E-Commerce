from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Producto, Carrito, ItemCarrito, Producto
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer, ProductSerializer, CarritoSerializer, ItemCarritoSerializer

from .validations import custom_validation # No es util

'''
    Cambiar el sistema de autenticación a token-based en el futuro.
    Por ahora, se usa session-based auth para simplicidad.

    Se agregó el uso de JWT tokens para autenticación.
    Pero no se quitó el sistema de session-based auth.
'''

def get_csrf_token(request):
    token = get_token(request)  # Obtén el token CSRF
    return JsonResponse({'csrfToken': token})

# Cualquiera puede acceder al registro
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
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
    permission_classes = (permissions.AllowAny,)
    
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
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# Muestra datos correctamente. No obstante, también se puede obtener desde el token JWT, por que un usuario deslogeado puede ver los datos.
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class ProductCreate(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden crear productos (is_staff=True)
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
    lookup_field = 'IdProducto'

class ProductUpdate(UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'IdProducto'

    def perform_update(self, serializer):
        # Lógica adicional
        serializer.save()

class ProductDelete(DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Solo admins pueden ver la lista de productos
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'IdProducto'

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
            producto = Producto.objects.get(IdProducto=producto_id)
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