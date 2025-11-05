from django.contrib import admin
from .models import UsuarioApp, Producto, Categoria, TipoProducto, Orden, OrdenProducto, Pago

@admin.register(UsuarioApp)  
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email', 'nombre', 'apellido', 'is_staff')
    list_editable =   ('nombre', 'apellido')
    search_fields = ('email',)  
    list_filter = ('is_staff',) 

# admin.site.register(Producto)
# admin.site.register(Categoria)
# admin.site.register(TipoProducto)

class ProductoAdmin(admin.ModelAdmin):
    # Muestra estos campos en la lista principal
    list_display = (
        'nombre_producto', 
        'categoria', 
        'tipo', 
        'stock_producto', 
        'precio_transferencia'
    )
    
    # ¡LA MAGIA! Permite editar estos campos en la lista
    list_editable = (
        'categoria', 
        'tipo', 
        'stock_producto'
    )
    
    # Añade filtros para encontrar productos rápido
    list_filter = ('categoria', 'tipo')
    
    # Añade una barra de búsqueda
    search_fields = ('nombre_producto', 'marca_producto')

# Registra los modelos para que aparezcan en el panel de admin
admin.site.register(Producto, ProductoAdmin) # Usa la clase "tuneada"
admin.site.register(Categoria)
admin.site.register(TipoProducto)
admin.site.register(Orden)
admin.site.register(OrdenProducto)
admin.site.register(Pago)