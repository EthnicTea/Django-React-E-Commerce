# APIbackend/migrations/0018_create_superuser.py

from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    """
    Lee las variables de entorno de Render y crea un superusuario.
    """
    User = apps.get_model('APIbackend', 'UsuarioApp') 

    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    if not email or not password:
        print("Variables de superusuario (DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD) no configuradas, saltando creación.")
        return

    if not User.objects.filter(email=email).exists():
        print(f"Creando superusuario: {email}")
        
        # NO llamamos a .create_superuser()
        # LLAMAMOS a .create_user() y pasamos los flags manualmente.
        User.objects.create_user(
            email=email,
            password=password,
            is_staff=True,
            is_superuser=True
        )
        # ---------------------------------
        
    else:
        print(f"Superusuario {email} ya existe.")

class Migration(migrations.Migration):

    dependencies = [
        # (Asegúrate que esto apunte a tu migración anterior, ej: '0017_..._data')
        ('APIbackend', '0017_alter_orden_usuario_orden'), 
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]