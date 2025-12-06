from django.db import models
# Esta librería nos sirve para que el administrador de usuarios herede capacidades
# que nosotros no queremos realizar
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

# Creando un manager para crear modelos customizados

class UsuarioAppManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Se requiere un email.')
        if not password:
            raise ValueError('Se requiere de una contraseña.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None,  **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if not email:
            raise ValueError('Se requiere un email.')
        if not password:
            raise ValueError('Se requiere de una contraseña.')
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.save()
        return user

class UsuarioApp(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=50)
    # Cambiar después por datos obligatorios o simplemente solicitarlos por el front end!
    rut = models.CharField(max_length=12, unique=True, blank=True, null=True)
    nombre = models.CharField(max_length=30, blank=True, null=True)
    apellido = models.CharField(max_length=30, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    region = models.TextField(blank=True, null=True)
    comuna = models.TextField(blank=True, null=True)
    # numeroc, debe ser dirección, se debe cambiar, también en el frontend!
    direccion = models.CharField(blank=True, null=True, max_length=255)
    data_departamento = models.CharField(blank=True, null=True, max_length=255)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioAppManager()

    # Como antes, el email es el username, los nombres son solo datos de envío
    USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['nombre', 'apellido']  # Datos requeridos adicionales para el registro

    def __str__(self):
        return self.email
    
class Categoria(models.Model):
    """ Categoria Navbar """
    categoria_id = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.nombre_categoria

class TipoProducto(models.Model):
    """ Modelo para los productos como tal. Ejemplo: CPU, GPU, RAM, etc. """
    tipo_id = models.AutoField(primary_key=True)
    nombre_tipo = models.CharField(max_length=100, unique=True)
    info_adicional = models.TextField(blank=True, null=True) # Info relevante como especificaciones generales
    
    def __str__(self):
        return self.nombre_tipo

# Quizás agregar una tabla de "ficha técnica" todos los datos específicos
class Producto(models.Model):
    producto_id = models.AutoField(primary_key=True)
    nombre_producto = models.CharField(max_length=200)
    marca_producto = models.CharField(max_length=100)
    descripcion_producto = models.TextField()
    precio_transferencia = models.IntegerField()
    precio_otro = models.IntegerField()
    stock_producto = models.IntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    tipo = models.ForeignKey(TipoProducto, on_delete=models.SET_NULL, null=True)
    imagen = models.URLField(null=True, blank=True)
    watts = models.IntegerField(default=0, null=True, blank=True) # Es solo para el apartado de armados de PC, no todos tienen que tener este valor!
    es_destacado = models.BooleanField(default=False)
    descuento = models.IntegerField(default=0, null=True, blank=True) # Tampoco es obligatorio

    @property
    def precio_final_transferencia(self):
        if self.descuento > 0:
            # Descuento y redondeo
            precio_calc = self.precio_transferencia * (1 - (self.descuento / 100))
            return int(precio_calc)
        # Si no hay descuento, ps nomás
        return self.precio_transferencia
    
    @property
    def precio_final_otro(self):
        if self.descuento > 0: # Lo mismo pero para el otro precio
            precio_calc = self.precio_otro * (1 - (self.descuento / 100))
            return int(precio_calc)
        return self.precio_otro

    def __str__(self):
        return self.nombre_producto

class OrdenProducto(models.Model):
    orden = models.ForeignKey('Orden', on_delete=models.CASCADE)
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

class Orden(models.Model):
    orden_id = models.AutoField(primary_key=True)
    fecha_orden = models.DateField(auto_now_add=True)
    estado_orden = models.CharField(max_length=30, default='Pendiente')
    usuario_orden = models.ForeignKey(
        'UsuarioApp', 
        on_delete=models.SET_NULL, # Nunca se borrará una orden.
        null=True,                 
        blank=True                 
    )
    productos = models.ManyToManyField('Producto', through=OrdenProducto)
    total_orden = models.IntegerField(blank=True, null=True) # Se puede calcular dinámicamente

    class Meta:
        permissions = [
            ("puede_editar_ordenes", "Puede editar órdenes de clientes"),
        ]

class Pago(models.Model):
    pago_id = models.AutoField(primary_key=True)
    orden = models.OneToOneField('Orden', on_delete=models.CASCADE)
    metodo_pago = models.CharField(max_length=20)
    monto_pago = models.IntegerField()
    fecha_pago = models.DateField(auto_now_add=True)

class Carrito(models.Model):
    usuario = models.OneToOneField('UsuarioApp', on_delete=models.CASCADE, related_name="carrito")
    # Este campo asegura que un usuario solo tenga un carrito "activo" a la vez.
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    def vaciar(self):
        self.items.all().delete() # Elimina todos los items del carrito 

    def __str__(self):
        return f"Carrito de {self.usuario.email}"

class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('carrito', 'producto')

    def subtotal(self):
        return self.cantidad * self.producto.precio_transferencia

    def __str__(self):
         return f"{self.cantidad} x {self.producto.nombre_producto}"