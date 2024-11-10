from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
UserModel = get_user_model()

def custom_validation(data):
    email = data['email'].strip()
    # username = data['username'].strip()
    password = data['password'].strip()
    ###
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('Elija otro correo')
    ##
    if not password or len(password) < 8:
        raise ValidationError('Elija una contraseña con al menos 8 caracteres')
    ##
    '''if not username:
        raise ValidationError('Eliga otro nombre')
    return data'''


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('El email es obligatorio')
    return True

'''def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('Eliga otro nombre')
    return True'''

def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('Se necesita una contraseña')
    return True