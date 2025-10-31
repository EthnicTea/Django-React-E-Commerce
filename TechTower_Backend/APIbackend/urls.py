from django.urls import path
from . import views
from .views import get_csrf_token
from rest_framework.routers import DefaultRouter

appname = "APIbackend"

urlpatterns = [
	path('register/', views.UserRegister.as_view(), name='register'),
	path('login/', views.UserLogin.as_view(), name='login'),
	path('logout/', views.UserLogout.as_view(), name='logout'),
	path('user/', views.UserView.as_view(), name='user'),
    path('csrf/', get_csrf_token, name='csrf_token'),
    # Productos
    path('products/create', views.ProductCreate.as_view(), name='product-create'),
    path('products/', views.ProductList.as_view(), name='product-list'),
    path('products/<int:producto_id>/', views.ProductDetailUpdateDelete.as_view(), name='product-detail-edit'),
    path('products/bulk_create/', views.ProductBulkCreate.as_view(), name='product-bulk-create'),
    # Carrito de Compras
    path('cart/', views.CartView.as_view(), name='cart-view'),
    # Asistente IA
    path('ia/compatibilidad/', views.AsistenteIAViewCompatible.as_view(), name='compatibilidad-ia'),
    path('ia/presupuesto/', views.AsistenteIAViewPresupuesto.as_view(), name='generar_presupuesto_ia'), 
    path('chat/', views.ChatbotAPIView.as_view(), name='chatbot_api'),

    # Api de pago, ya no hay api de pago, se simula

    # Checkout y creación de orden
    path('checkout/create_order/', views.CreateOrderView.as_view(), name='create-order'),
]