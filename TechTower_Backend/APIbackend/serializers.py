from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Producto, Carrito, ItemCarrito, Orden, OrdenProducto

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

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar los campos de perfil del usuario.
    No incluye email ni contraseña.
    """
    class Meta:
        model = UserModel
        
        # Lista solo los campos que el usuario PUEDE cambiar
        fields = (
            "email", # SOLO PARA MOSTRAR EN EL FRONTEND
            'nombre', 
            'apellido', 
            'telefono', 
            'direccion', 
            'region', 
            'comuna', 
            'data_departamento',
            'is_staff'
        )
        
        # Ninguno es obligatorio en la actualización
        extra_kwargs = {
            'nombre': {'required': False},
            'apellido': {'required': False},
            'telefono': {'required': False},
            'direccion': {'required': False},
            'region': {'required': False},
            'comuna': {'required': False},
            'data_departamento': {'required': False},
            'is_staff': {'required': False},
        }

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ()

# Serializadores para el carrito de compras

class ProductoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        # Define los campos que el carrito necesita
        fields = ['producto_id', 'nombre_producto', 'imagen', 'precio_transferencia', 'precio_otro']

class ItemCarritoSerializer(serializers.ModelSerializer):
    producto = ProductoSimpleSerializer(read_only=True) 

    class Meta:
        model = ItemCarrito
        fields = ['id', 'producto', 'cantidad']
        read_only_fields = ['id']

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'items', 'activo', 'creado_en']
        read_only_fields = ['id', 'usuario', 'activo', 'creado_en']

# Serializers para las ordenes -_-

class OrdenProductoSimpleSerializer(serializers.ModelSerializer):
    """ Muestra el producto y cantidad dentro de una orden """
    # Usamos el ProductoSimpleSerializer que ya teníamos (o uno similar)
    producto = ProductoSimpleSerializer(read_only=True) 
    
    class Meta:
        model = OrdenProducto
        fields = ['producto', 'cantidad']

class OrdenSerializer(serializers.ModelSerializer):
    """ Serializer principal para la Orden """
    # 'items' es el related_name que DEBERÍAS poner en tu
    # ForeignKey de OrdenProducto a Orden. 
    # Si no lo pusiste, el 'source' por defecto es 'ordenproducto_set'
    items = OrdenProductoSimpleSerializer(many=True, read_only=True, source='ordenproducto_set')

    class Meta:
        model = Orden
        fields = ['orden_id', 'fecha_orden', 'estado_orden', 'total_orden', 'items']