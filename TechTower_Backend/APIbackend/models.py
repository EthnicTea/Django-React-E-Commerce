from django.db import models
# Esta librería nos sirve para que el administrador de usuarios herede capacidades
# que nosotros no queremos realizar
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

# Creando un manager para crear modelos customizados

class UsuarioAppManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Se requiere un email.')
        if not password:
            raise ValueError('Se requiere de una contraseña.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('Se requiere un email.')
        if not password:
            raise ValueError('Se requiere de una contraseña.')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user

class UsuarioApp(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=50)
    rut = models.CharField(max_length=12, unique=True)
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    region = models.TextField(blank=True, null=True)
    comuna = models.TextField(blank=True, null=True)
    # numeroc, debe ser dirección, se debe cambiar, también en el frontend!
    numeroc = models.IntegerFieldField(blank=True, null=True, max_length=5)
    data_departamento = models.IntegerFieldField(blank=True, null=True, max_length=5)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioAppManager()

    # Como antes, el email es el username, los nombres son solo datos de envío
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['rut', 'nombre', 'apellido']  # Datos requeridos adicionales para el registro

    def __str__(self):
        return self.email

class Producto(models.Model):
    IdProducto = models.AutoField(primary_key=True)
    NomProducto = models.CharField(max_length=30)
    DescripcionProducto = models.TextField()
    PrecioProducto = models.IntegerField()
    StockProducto = models.PositiveIntegerField()

class Orden(models.Model):
    IdOrden = models.AutoField(primary_key=True)
    FechaOrden = models.DateField(max_length=10)
    EstadoOrden = models.CharField(max_length=30)
    UsuarioOrden = models.ForeignKey(UsuarioApp, on_delete=models.CASCADE)
    ProductOrden = models.ManyToManyField(Producto)
    TotalOrden = models.IntegerField()

class Pago(models.Model):
    IdPago = models.AutoField(primary_key=True)
    MetodoPago = models.CharField(max_length=20)
    MontoPago = models.IntegerField()
    FechaPago = models.DateField(max_length=10)

class Carrito(models.Model):
    IdCarrito = models.AutoField(primary_key=True)
    UsuarioCarrito = models.ForeignKey(UsuarioApp, on_delete=models.CASCADE)
    ListaProducto = models.ManyToManyField(Producto)
    Total = models.IntegerField()