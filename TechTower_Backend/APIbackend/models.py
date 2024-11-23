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
    direccion = models.CharField(blank=True, null=True, max_length=25)
    data_departamento = models.CharField(blank=True, null=True, max_length=25)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioAppManager()

    # Como antes, el email es el username, los nombres son solo datos de envío
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']  # Datos requeridos adicionales para el registro

    def __str__(self):
        return self.email

class Producto(models.Model):
    IdProducto = models.AutoField(primary_key=True)
    NomProducto = models.CharField(max_length=200)
    MarcaProducto = models.CharField(max_length=100)
    CategoriaProducto = models.CharField(max_length=50)
    DescripcionProducto = models.TextField()
    PrecioTransferencia = models.IntegerField()
    PrecioOtroMetodo = models.IntegerField()
    StockProducto = models.IntegerField()
    ImagenProducto = models.URLField()

    def __str__(self):
        return self.NomProducto

class OrdenProducto(models.Model):
    Orden = models.ForeignKey('Orden', on_delete=models.CASCADE)
    Producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    Cantidad = models.PositiveIntegerField(default=1)

class Orden(models.Model):
    IdOrden = models.AutoField(primary_key=True)
    FechaOrden = models.DateField(auto_now_add=True)
    EstadoOrden = models.CharField(max_length=30, default='Pendiente')
    UsuarioOrden = models.ForeignKey('UsuarioApp', on_delete=models.CASCADE)
    Productos = models.ManyToManyField('Producto', through=OrdenProducto)
    TotalOrden = models.IntegerField(blank=True, null=True)

class Pago(models.Model):
    IdPago = models.AutoField(primary_key=True)
    Orden = models.OneToOneField('Orden', on_delete=models.CASCADE)
    MetodoPago = models.CharField(max_length=20)
    MontoPago = models.IntegerField()
    FechaPago = models.DateField(auto_now_add=True)

'''class Carrito(models.Model):
    UsuarioCarrito = models.ForeignKey('UsuarioApp', on_delete=models.CASCADE)
    ProductoCarrito = models.ForeignKey('Producto', on_delete=models.CASCADE) 
    CantidadCarrito = models.PositiveIntegerField(default=1) 
    FechaAgregado = models.DateTimeField(auto_now_add=True)

    # Calcular el total dinámicamente.
    # Vincular el carrito con las órdenes.
    # Procesar pagos y confirmar pedidos.'''