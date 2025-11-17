from django.db import migrations
from django.contrib.auth.hashers import make_password
import os

def create_superuser(apps, schema_editor):
    """
    Crea un superusuario leyendo variables de entorno.
    Usa make_password() para hashear la contraseña manualmente.
    """
    User = apps.get_model('APIbackend', 'UsuarioApp')

    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    if not email or not password:
        print("⚠️ Variables de superusuario no configuradas, saltando creación.")
        return

    if User.objects.filter(email=email).exists():
        print(f"✓ Superusuario {email} ya existe.")
        return

    print(f"🔧 Creando superusuario: {email}")
    
    User.objects.create(
        email=email,
        password=make_password(password),
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    
    print(f"✓ Superusuario {email} creado exitosamente.")

class Migration(migrations.Migration):

    dependencies = [
        ('APIbackend', '0018_create_superuser'),  # ← Depende de la 0018 fallida
    ]

    operations = [
        migrations.RunPython(create_superuser, reverse_code=migrations.RunPython.noop),
    ]