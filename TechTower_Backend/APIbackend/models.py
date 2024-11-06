from django.db import models

# Create your models here.
class Producto(models.Model):
    IdProducto = models.AutoField(primary_key=True)
    NomProducto = models.CharField(max_length=30)
    DescripcionProducto = models.TextField()
    PrecioProducto = models.IntegerField()
    StockProducto = models.PositiveIntegerField()

class Usuario(models.Model):
    IdUsuario = models.AutoField(primary_key=True)
    NombreUsuario = models.CharField(max_length=30)
    EmailUsuario = models.EmailField()
    DireccionUsuario = models.CharField(max_length=30)

class Orden(models.Model):
    IdOrden = models.AutoField(primary_key=True)
    FechaOrden = models.DateField(max_length=10)
    EstadoOrden = models.CharField(max_length=30)
    UsuarioOrden = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    ProductOrden = models.ManyToManyField(Producto)
    TotalOrden = models.IntegerField()

class Pago(models.Model):
    IdPago = models.AutoField(primary_key=True)
    MetodoPago = models.CharField(max_length=20)
    MontoPago = models.IntegerField()
    FechaPago = models.DateField(max_length=10)

class Carrito(models.Model):
    IdCarrito = models.AutoField(primary_key=True)
    ListaProducto = models.ManyToManyField(Producto)
    Total = models.IntegerField()