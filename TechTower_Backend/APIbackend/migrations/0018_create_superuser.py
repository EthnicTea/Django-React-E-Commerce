from django.db import migrations
import os # Para leer las variables de entorno

def create_superuser(apps, schema_editor):
    """
    Lee las variables de entorno de Render y crea un superusuario.
    """
    # obtencion
    User = apps.get_model('APIbackend', 'UsuarioApp')

    # Leemos las variables 
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    # Si las variables no existen, no hacemos nada...
    if not email or not password:
        print("Variables de superusuario (DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD) no configuradas, saltando creación.")
        return

    # Creamos el superusuario si no existe!
    if not User.objects.filter(email=email).exists():
        print(f"Creando superusuario: {email}")
        
        # IMPORTANTE: EL modelo UsuarioApp usa 'email' como USERNAME_FIELD!
        # Si tu modelo requiere otros campos (como 'rut'), se añaden aquí.
        User.objects.create_superuser(
            email=email,
            password=password
        )
    else:
        print(f"Superusuario {email} ya existe.")

class Migration(migrations.Migration):

    # SE REEMPLAZA el nombre
    # de la ÚLTIMA migración real!
    dependencies = [
        ('APIbackend', '0017_alter_orden_usuario_orden'), 
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]