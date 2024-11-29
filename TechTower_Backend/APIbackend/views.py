from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer, ProductSerializer
from rest_framework import permissions, status
from .models import Producto
from .validations import custom_validation # custom_product
def get_csrf_token(request):
    token = get_token(request)  # Obtén el token CSRF
    return JsonResponse({'csrfToken': token})

# Cualquiera puede acceder al registro
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print(request.data)
        clean_data = custom_validation(request.data)
        clean_data = request.data
        serializer = UserRegisterSerializer(data=clean_data)
        # Una vez que el usuario haya creado y pasado todas las comprobaciones
        # el metodo serializer creará un nuevo usuario
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
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
            # Usamos authenticate con el email si es un modelo personalizado
            user = authenticate(request, username=email, password=password)
            if user is not None:
                try: 
                    # Si el usuario es válido, logueamos al usuario
                    login(request, user)
                    return Response({"email": user.email, 'is_staff': user.is_staff, "message": "Login exitoso"}, status=status.HTTP_200_OK)
                except Exception as e:
                    print("Error al autenticar:", str(e))
                    return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_400_BAD_REQUEST)
        print("Errores del serializador:", serializer.errors)  # Depuración
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Metodo post para ejectutar el logout    
class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class ProductCreate(APIView):
    def post(self, request):
        print(request.data)
        # clean_data = custom_product(request.data)
        serializer = ProductSerializer(data=request.data)
        data = request.data
        if serializer.is_valid(raise_exception=True):
            producto = serializer.create(data)
            producto.save()
            if producto:
                return Response({"success": True, "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
      
class ProductList(ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer

# Detalle de un producto específico
class ProductDetail(RetrieveAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'IdProducto'

class ProductUpdate(UpdateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'IdProducto'

    def perform_update(self, serializer):
        # Lógica adicional
        serializer.save()

class ProductDelete(DestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'IdProducto'
