from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Producto

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
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            print("No se encuentra ese usuario")
            raise serializers.ValidationError('No se encuentra ese usuario.')
        data['user'] = user  # Puedes incluir el usuario autenticado en los datos validados
        return data
    print("Serializer ha fallado")

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'rut', 'nombre', 'apellido', 'telefono', 'region', 'comuna', 'direccion', 'data_departamento', 'is_staff')


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
    
    def create(self, data):
        product_obj = Producto.objects.create(
            NomProducto=data['NomProducto'],
            MarcaProducto=data['MarcaProducto'],
            CategoriaProducto=data['CategoriaProducto'],
            DescripcionProducto=data['DescripcionProducto'],
            PrecioTransferencia=data['PrecioTransferencia'],
            PrecioOtroMetodo=data['PrecioOtroMetodo'],
            StockProducto=data['StockProducto'],
            ImagenProducto=data['ImagenProducto'],
        )
        return product_obj

class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ()