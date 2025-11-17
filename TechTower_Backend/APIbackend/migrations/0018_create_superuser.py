# APIbackend/migrations/0018_create_superuser.py

from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    """
    Lee las variables de entorno y crea un superusuario
    de forma manual (bypass del manager).
    """
    User = apps.get_model('APIbackend', 'UsuarioApp') 

    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    if not email or not password:
        print("Variables de superusuario no configuradas, saltando creación.")
        return

    if not User.objects.filter(email=email).exists():
        print(f"Creando superusuario: {email}")
        
        user = User(
            email=email,
            is_staff=True,
            is_superuser=True
        )
        
        user = User.objects.create_user(email, password)
        
        user.save()
        
    else:
        print(f"Superusuario {email} ya existe.")

class Migration(migrations.Migration):

    dependencies = [
        ('APIbackend', '0017_alter_orden_usuario_orden'), 
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]