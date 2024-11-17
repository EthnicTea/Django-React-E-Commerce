from django.urls import path
from . import views
from .views import get_csrf_token

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
    path('csrf/', get_csrf_token, name='csrf_token'),
]