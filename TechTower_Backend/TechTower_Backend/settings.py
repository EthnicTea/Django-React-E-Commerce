from pathlib import Path
import pymysql
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url
import os

# Cargar un ambiente virtual para la aplicación, para las credenciales de la base de datos 
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 

# SECURITY WARNING: don't run with debug turned on in production!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# El * es para que permita cualquier host alojar la aplicación como tal. Luego si se quisiera alojar en
# un servidor, se debe cambiar!
ALLOWED_HOSTS = ["*"] # ejemplo: 'backend.onrender.com'

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    "https://techtower.duckdns.org",
    "https://django-react-e-commerce-cjge.vercel.app", # Url de vercel en desarrollo con el backend en Render!
    "https://django-react-e-commerce.vercel.app", # Url que está ligado a vercel con el backend de AWS EC2!
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://techtower.duckdns.org",
    "https://django-react-e-commerce-cjge.vercel.app", # Url de vercel en desarrollo con el backend en Render!
    "https://django-react-e-commerce.vercel.app", # Url que está ligado a vercel con el backend de AWS EC2!
]

CORS_ALLOW_CREDENTIALS = True

# Importante para el uso de JWT Tokens que serviran para la verificación de personal dentro de la página web.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication', 
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# El token vence en 30 minutos haciendo que se tenga que logear otra vez.
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': 'django-insecure-tv%g_dmzi$ag&0m0guqbb**32fhn)0@fu136@wm1da7#^=-+y6', # Misma que SECRET_KEY
    'VERIFYING_KEY': '',
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'user_id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'APIbackend',
    'django_extensions',
    'django_filters',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'TechTower_Backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'TechTower_Backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

pymysql.install_as_MySQLdb()
pymysql.version_info = (1, 4, 3, "final", 0)

#  =========== Alternar entre base de datos local y producción =========== 
# Configuración de la base de datos para desarrollo local con SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}

# Configuración de la base de datos para producción en Render usando dj_database_url
# DATABASES = {
#     'default': dj_database_url.config(
#         # Render Variables de entorno para la base de datos
#         default=os.environ.get('DATABASE_URL')
#     )
# }

AUTH_USER_MODEL = 'APIbackend.UsuarioApp'

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#CORS_ALLOW_ALL_ORIGINS = True # Comentar esta línea si se quiere especificar orígenes específicos (más arriba están especificados).

CORS_ALLOWED_ORIGINS = [  # Lista de orígenes permitidos para solicitudes CORS.
    'http://localhost:5173',
    'https://django-react-e-commerce-cjge.vercel.app',
]

CORS_ALLOWS_CREDENTIALS = True # Permitir el envío de cookies y credenciales en solicitudes CORS.