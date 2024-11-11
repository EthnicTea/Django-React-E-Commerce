from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password

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
    

# También esta vista será visible para todos

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()  # No se necesita autenticación previa

    def post(self, request):
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            email = data.get('email')
            password = data.get('password')
            # Usamos authenticate con el email si es un modelo personalizado
            user = authenticate(request, username=email, password=password)
            if user is not None:
                # Si el usuario es válido, logueamos al usuario
                login(request, user)
                return Response({"message": "Login exitoso"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Metodo post para ejectutar el logout    
class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# La vista del usuario asumirá que si hay autenticación
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)