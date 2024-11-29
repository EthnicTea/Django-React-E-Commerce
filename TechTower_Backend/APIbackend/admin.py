from django.contrib import admin
from .models import UsuarioApp

@admin.register(UsuarioApp)  
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'email', 'is_staff')  
    search_fields = ('email',)  
    list_filter = ('is_staff',) 