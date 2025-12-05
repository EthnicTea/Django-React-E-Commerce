from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Producto, Carrito, ItemCarrito, Orden, OrdenProducto, TipoProducto, Categoria

UserModel = get_user_model()

# Tres serializadores para cada acción
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'email', 
            'password', 
            'rut', 
            'nombre', 
            'apellido', 
            'telefono', 
            'region', 
            'comuna', 
            'direccion', 
            'data_departamento' 
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Sacamos los campos extra de 'validated_data'
        # Usamos .pop() para quitarlos, así solo quedan 'email' y 'password'
        rut = validated_data.pop('rut', None)
        nombre = validated_data.pop('nombre', None)
        apellido = validated_data.pop('apellido', None)
        telefono = validated_data.pop('telefono', None)
        region = validated_data.pop('region', None)
        comuna = validated_data.pop('comuna', None)
        direccion = validated_data.pop('direccion', None)
        data_departamento = validated_data.pop('data_departamento', None)

        # Creamos el usuario solo con email y password
        user_obj = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Asignamos los campos extra al objeto de usuario
        user_obj.rut = rut
        user_obj.nombre = nombre
        user_obj.apellido = apellido
        user_obj.telefono = telefono
        user_obj.region = region
        user_obj.comuna = comuna
        user_obj.direccion = direccion
        user_obj.data_departamento = data_departamento

        # Guardamos los cambios
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


class OrdenItemInputSerializer(serializers.Serializer):
    """ Ayuda a validar la entrada de datos para editar items """
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField()

class OrdenAdminUpdateSerializer(serializers.ModelSerializer):
    items = OrdenProductoSimpleSerializer(many=True, read_only=True, source='ordenproducto_set')
    usuario_orden = serializers.StringRelatedField(read_only=True)

    items_editar = OrdenItemInputSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = Orden
        fields = [
            'orden_id', 'fecha_orden', 'estado_orden', 'usuario_orden', 'total_orden', 
            'items',      
            'items_editar'   
        ]
        read_only_fields = ['orden_id', 'fecha_orden', 'usuario_orden', 'items']

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items_editar', None)

        instance.estado_orden = validated_data.get('estado_orden', instance.estado_orden)
        instance.total_orden = validated_data.get('total_orden', instance.total_orden)
        instance.save()

        # Si nos enviaron una nueva lista de items...
        if items_data is not None:
            instance.ordenproducto_set.all().delete()

            # B. Creamos los nuevos items
            for item in items_data:
                OrdenProducto.objects.create(
                    orden=instance,
                    producto_id=item['producto_id'],
                    cantidad=item['cantidad']
                )
        
        return instance

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['categoria_id', 'nombre_categoria']

class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = ['tipo_id', 'nombre_tipo']