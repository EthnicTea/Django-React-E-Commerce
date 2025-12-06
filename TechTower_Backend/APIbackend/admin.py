from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    UsuarioApp, Producto, Categoria, TipoProducto, 
    Orden, OrdenProducto, Pago
)

@admin.register(UsuarioApp)
class UsuarioAdmin(BaseUserAdmin):
    list_display = (
        'user_id', 
        'email', 
        'nombre', 
        'apellido', 
        'telefono', 
        'region', 
        'comuna', 
        'is_staff', 
        'is_superuser',
        'ver_grupos'
    )
    list_editable = (
        'nombre', 
        'apellido', 
        'telefono', 
        'region', 
        'comuna', 
        'is_staff', 
        'is_superuser',
    )
    search_fields = ('email', 'nombre', 'apellido')
    list_filter = ('is_staff', 'is_superuser', 'region', 'groups') 
    ordering = ('user_id',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre', 'apellido', 'telefono', 'direccion', 'data_departamento', 'region', 'comuna')}),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Fechas importantes', {'fields': ('last_login',)}), 
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_superuser', 'groups'),
        }),
    )

    def ver_grupos(self, obj):
        return ", ".join([g.name for g in obj.groups.all()])
    
    ver_grupos.short_description = 'Grupos'

# --- Admin de Producto ---
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        'producto_id',
        'nombre_producto', 
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