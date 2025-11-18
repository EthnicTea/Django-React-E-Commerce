from django.contrib import admin
from .models import (
    UsuarioApp, Producto, Categoria, TipoProducto, 
    Orden, OrdenProducto, Pago
)
@admin.register(UsuarioApp)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        'user_id', 
        'email', 
        'nombre', 
        'apellido', 
        'telefono', 
        'region', 
        'comuna', 
        'is_staff', 
        'is_superuser'
    )
    list_editable = (
        'nombre', 
        'apellido', 
        'telefono', 
        'region', 
        'comuna', 
        'is_staff', 
        'is_superuser'
    )
    search_fields = ('email', 'nombre', 'apellido')
    list_filter = ('is_staff', 'is_superuser', 'region') 
    ordering = ('user_id',) 

# --- Admin de Producto (El tuyo, un poco mejorado) ---
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'producto_id', # Es bueno ver el ID
        'nombre_producto', 
        'categoria', 
        'tipo', 
        'stock_producto', 
        'precio_transferencia',
        'precio_otro', # Añadido
        'descuento',
        'es_destacado',
        'watts',
        'imagen'
    )
    list_editable = (
        'categoria', 
        'tipo', 
        'stock_producto',
        'precio_transferencia', 
        'precio_otro',          
        'descuento',
        'es_destacado',
        'watts',
        'imagen'
    )
    list_filter = ('categoria', 'tipo', 'es_destacado', 'marca_producto')
    search_fields = ('nombre_producto', 'marca_producto', 'producto_id')
    ordering = ('producto_id',)


class OrdenProductoInline(admin.TabularInline):
    """
    Esto permite ver y editar los *productos* DENTRO de una orden.
    """
    model = OrdenProducto
    readonly_fields = ('producto', 'cantidad')
    extra = 0 

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = (
        'orden_id', 
        'usuario_orden', 
        'fecha_orden', 
        'estado_orden', 
        'total_orden'
    )
    list_editable = ('estado_orden',) 
    list_filter = ('estado_orden', 'fecha_orden')
    search_fields = ('orden_id', 'usuario_orden__email')
    ordering = ('-fecha_orden',) 
    inlines = [OrdenProductoInline]

admin.site.register(Categoria)
admin.site.register(TipoProducto)
admin.site.register(Pago)
admin.site.register(OrdenProducto)