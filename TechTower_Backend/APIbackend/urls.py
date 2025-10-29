from django.urls import path
from . import views
from .views import get_csrf_token, webhook_mp
from .views import mercadopago_webhook, create_preference_from_db

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
    path('products/<int:id>', views.ProductDetail.as_view(), name='product-detail'),
    path('products/update/<int:IdProducto>', views.ProductUpdate.as_view(), name='product-update'),
    path('products/delete/<int:IdProducto>', views.ProductDelete.as_view(), name='product-delete'),
    # Carrito de Compras
    path('cart/', views.CartView.as_view(), name='cart-view'),
    path('ia/compatibilidad/', views.AsistenteIAViewCompatible.as_view(), name='compatibilidad-ia'),
    path('ia/presupuesto/', views.AsistenteIAViewPresupuesto.as_view(), name='generar_presupuesto_ia'), 

    # ENDPOINT PARA INICIAR EL PAGO (Llamada desde React)
    path('mp/crear/', views.CrearPreferenciaMP.as_view(), name='mp_crear_preferencia'),
    
    # ENDPOINT DE NOTIFICACIÓN (Llamada desde Mercado Pago)
    path('mp/webhook/', webhook_mp, name='mp_webhook'),
    
    # Mercado pago
    # 1. La ruta de checkout que crea la ORDEN
    path('checkout/create/', views.checkout_create_order, name='checkout_create_order'),
    
    # 2. La ruta de la API de Mercado Pago que espera el ID
    path('payments/create/<int:orden_id>/', views.create_preference_from_db, name='create_preference'),
    # NOTA: Los paths /pago/exito y /pago/fallo/ son URLs de React, no de Django!!!!!!

    path('api/webhooks/mercadopago', mercadopago_webhook, name='mercadopago_webhook'),
]