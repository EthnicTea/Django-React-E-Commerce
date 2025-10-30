from django.contrib import admin
from .models import UsuarioApp, Producto, Categoria, TipoProducto

@admin.register(UsuarioApp)  
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email', 'is_staff')  
    search_fields = ('email',)  
    list_filter = ('is_staff',) 

admin.site.register(Producto)
admin.site.register(Categoria)
admin.site.register(TipoProducto)