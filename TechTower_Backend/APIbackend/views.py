from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserSerializer
from rest_framework import permissions, status

# Cualquiera puede acceder al registro
class UserRegister(APIView):
    '''permission_classes = (permissions.AllowAny,)
    def post(self, request):
        clean_data = '''

class UserLogin(APIView):
    pass

class UserLogout(APIView):
    pass

class UserView(APIView):
    pass