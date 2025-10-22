from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Producto, Carrito, ItemCarrito

UserModel = get_user_model()

# Tres serializadores para cada acción
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'password') 
        extra_kwargs = {'password': {'write_only': True}} # Oculta la contraseña en la respuesta de la API.

    def create(self, validated_data):
        # Solo email y password son obligatorios.
        # Los otros campos se dejarán con sus valores por defecto (blank=True, null=True).
        user_obj = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
        )
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
    # print("Serializer ha fallado")

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
            nombre_producto=data['nombre_producto'],
            marca_producto=data['marca_producto'],
            categoria_producto=data['categoria_producto'],
            descripcion_producto=data['descripcion_producto'],
            precio_transferencia=data['precio_transferencia'],
            precio_otro=data['precio_otro'],
            stock_producto=data['stock_producto'],
            imagen=data['imagen'],
        )
        return product_obj

class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ()

# Serializadores para el carrito de compras

class ItemCarritoSerializer(serializers.ModelSerializer):
    # Esto asegura que la respuesta de la API incluya la información del producto
    # en lugar de solo su ID.
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())

    class Meta:
        model = ItemCarrito
        fields = ['id', 'producto', 'cantidad']
        read_only_fields = ['id']

class CarritoSerializer(serializers.ModelSerializer):
    # Aquí anidamos el serializador del ItemCarrito.
    # El 'many=True' es crucial porque un carrito puede tener muchos items.
    items = ItemCarritoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'items', 'activo', 'creado_en']
        read_only_fields = ['id', 'usuario', 'activo', 'creado_en']