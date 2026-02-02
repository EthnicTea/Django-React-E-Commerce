# TechTower E-commerce

> Plataforma de E-commerce con Asistente Virtual Inteligente.
> *Proyecto de Título*

![techtowerbanner](https://github.com/user-attachments/assets/8eb09937-ecf1-436f-b390-152fa10f19f7)

## Descripción

**TechTower** es una solución integral de comercio electrónico diseñada para la venta de hardware/tecnología. A diferencia de un e-commerce tradicional, este proyecto integra un **Asistente de IA** capaz de ayudar a los usuarios a encontrar su computador personal ideal.

Este proyecto fue desarrollado como trabajo final de titulación, integrando una arquitectura desacoplada (Headless) y prácticas modernas de desarrollo web.

## Características Principales

* **Asistente Virtual con IA:** Integración de Gemini AI para asistencia en tiempo real.
* **Gestión de Catálogo:** ABM (Alta, Baja, Modificación) de productos y categorías.
* **Carrito de Compras:** Lógica de carrito persistente y gestión de órdenes.
* **Autenticación de Usuarios:** Sistema de registro y login seguro.
* **Panel de Administración:** Gestión de inventario y usuarios con un dashboard personalizado con gráficos.

## Tecnologías Utilizadas

El proyecto utiliza una arquitectura cliente-servidor:

### Backend (API)
* **Lenguaje:** Python
* **Framework:** Django & Django REST Framework (DRF)
* **Base de Datos:** SQLite para el MVP
* **IA/ML:** Gemini AI API

### Frontend (Cliente)
* **Framework:** React
* **Estilos:** CSS netamente
* **Estado:** Context API

## Instalación y Despliegue

Sigue estas instrucciones para levantar el proyecto localmente.

### 1. Configuración del Backend

```bash
cd backend
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # o .\venv\Scripts\activate en Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (.env)
# Nota: Las APIKEY aun siguen resguardadas

# Migraciones y servidor
python manage.py migrate
python manage.py runserver
```
### 2. Configuración del Frontend

```bash
cd frontend
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm start
```
