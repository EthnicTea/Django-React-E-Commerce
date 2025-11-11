from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Producto, Carrito, ItemCarrito, Orden, OrdenProducto, TipoProducto, Categoria

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
            'is_staff': {'required': False},
        }

class ProductSerializer(serializers.ModelSerializer):
    precio_final_transferencia = serializers.ReadOnlyField()
    precio_final_otro = serializers.ReadOnlyField()
    class Meta:
        model = Producto
        fields = [
            'producto_id', 
            'nombre_producto', 
            'marca_producto',
            'descripcion_producto',
            'precio_transferencia', 
            'precio_otro',
            'stock_producto',
            'categoria', 
            'tipo',      
            'imagen',
            'watts',
            'descuento',
            'es_destacado',
            'precio_final_transferencia',
            'precio_final_otro'
        ]

class ProductEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ()

# Serializadores para el carrito de compras

class ProductoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        # Define los campos que el carrito necesita
        fields = ['producto_id', 
                  'nombre_producto', 
                  'imagen', 
                  'precio_transferencia', 
                  'precio_otro',
                  'descuento',
                  'precio_final_transferencia'
                ]

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
    # 'items' es el related_name que SE DEBERÍA poner
    # ForeignKey de OrdenProducto a Orden. 
    # Si no está, el 'source' por defecto es 'ordenproducto_set'
    # En palabras sencillas, le decimos al "OrdenProductoSimple" que se encargue de mostrar los items.
    items = OrdenProductoSimpleSerializer(many=True, read_only=True, source='ordenproducto_set')

    usuario_orden = serializers.StringRelatedField()

    class Meta:
        model = Orden
        fields = ['orden_id', 'fecha_orden', 'estado_orden', 'usuario_orden', 'total_orden', 'items']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['categoria_id', 'nombre_categoria']

class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = ['tipo_id', 'nombre_tipo']