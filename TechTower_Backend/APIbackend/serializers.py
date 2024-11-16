from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

UserModel = get_user_model()

# Tres serializadores para cada acción
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'],
            rut=clean_data['rut'],
            nombre=clean_data['nombre'],
            apellido=clean_data['apellido'],
            telefono=clean_data['telefono'],
            region=clean_data['region'],
            comuna=clean_data['comuna'],
            direccion=clean_data['direccion'],
            data_departamento=clean_data['data_apartamento'],
            )
        user_obj.save()
        return user_obj
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    def check_user(self, clean_data):
        user = authenticate(email=clean_data['email'],
            password=clean_data['password'])
        if not user:
            raise ValidationError('No se encuentra ese usuario')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'rut', 'nombre', 'apellido', 'telefono', 'region', 'comuna', 'direccion', 'data_apartamento')