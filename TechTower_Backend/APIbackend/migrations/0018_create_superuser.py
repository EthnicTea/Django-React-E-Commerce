# APIbackend/migrations/0018_create_superuser.py

from django.db import migrations
from django.contrib.auth.hashers import make_password
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model('APIbackend', 'UsuarioApp')
    
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
    
    if not email or not password:
        print("⚠️ Variables no configuradas")
        return
    
    if User.objects.filter(email=email).exists():
        print(f"✓ Superusuario ya existe")
        return
    
    print(f"🔧 Creando superusuario...")
    User.objects.create(
        email=email,
        password=make_password(password),
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    print(f"✓ Creado!")

class Migration(migrations.Migration):
    dependencies = [
        ('APIbackend', '0017_alter_orden_usuario_orden'),
    ]
    operations = [
        migrations.RunPython(create_superuser, reverse_code=migrations.RunPython.noop),
    ]