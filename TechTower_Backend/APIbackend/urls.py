from django.urls import path
from . import views
from .views import get_csrf_token

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
    path('csrf/', get_csrf_token, name='csrf_token'),
    path('products/create', views.ProductCreate.as_view(), name='product-create'),
    path('products', views.ProductList.as_view(), name='product-list'),
    path('products/<int:id>', views.ProductDetail.as_view(), name='product-detail'),
    path('products/update/<int:IdProducto>', views.ProductUpdate.as_view(), name='product-update'),
    path('products/delete/<int:IdProducto>', views.ProductDelete.as_view(), name='product-delete'),
]