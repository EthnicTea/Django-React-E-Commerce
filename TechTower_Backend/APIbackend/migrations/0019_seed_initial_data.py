# APIbackend/migrations/0019_seed_initial_data.py

from django.db import migrations
from datetime import date
import os

def seed_data(apps, schema_editor):
    """
    Carga la base de datos con datos iniciales (Categorías, Tipos, Productos, Órdenes).
    """
    # Obtenemos los modelos históricos
    User = apps.get_model('APIbackend', 'UsuarioApp')
    Categoria = apps.get_model('APIbackend', 'Categoria')
    TipoProducto = apps.get_model('APIbackend', 'TipoProducto')
    Producto = apps.get_model('APIbackend', 'Producto')
    Orden = apps.get_model('APIbackend', 'Orden')
    OrdenProducto = apps.get_model('APIbackend', 'OrdenProducto')

    print("\nCreando Categorías y Tipos...")
    cat_computacion, _ = Categoria.objects.get_or_create(nombre_categoria="Computación")
    cat_gaming, _ = Categoria.objects.get_or_create(nombre_categoria="Streaming y Gaming")
    cat_componentes, _ = Categoria.objects.get_or_create(nombre_categoria="Componentes")
    cat_conectividad, _ = Categoria.objects.get_or_create(nombre_categoria="Conectividad y Redes")
    cat_audio, _ = Categoria.objects.get_or_create(nombre_categoria="Equipos de Audio y Video")

    tipo_cpu, _ = TipoProducto.objects.get_or_create(nombre_tipo="CPU")
    tipo_ram, _ = TipoProducto.objects.get_or_create(nombre_tipo="RAM")
    tipo_monitor, _ = TipoProducto.objects.get_or_create(nombre_tipo="Monitor")
    tipo_parlante, _ = TipoProducto.objects.get_or_create(nombre_tipo="Parlante")
    tipo_gpu, _ = TipoProducto.objects.get_or_create(nombre_tipo="GPU")
    tipo_mouse, _ = TipoProducto.objects.get_or_create(nombre_tipo="Mouse")
    tipo_microfono, _ = TipoProducto.objects.get_or_create(nombre_tipo="Microfono")
    tipo_audifonos, _ = TipoProducto.objects.get_or_create(nombre_tipo="Audifono")
    tipo_acceseorio, _ = TipoProducto.objects.get_or_create(nombre_tipo="Accesorio")
    tipo_ap, _ = TipoProducto.objects.get_or_create(nombre_tipo="Access Point")
    tipo_rf, _ = TipoProducto.objects.get_or_create(nombre_tipo="Refrigeracion Liquida")
    tipo_ssd, _ = TipoProducto.objects.get_or_create(nombre_tipo="SSD")
    tipo_psu, _ = TipoProducto.objects.get_or_create(nombre_tipo="PSU")
    tipo_gabinete, _ = TipoProducto.objects.get_or_create(nombre_tipo="Gabinete")
    tipo_pm, _ = TipoProducto.objects.get_or_create(nombre_tipo="Placa Madre")
    tipo_teclado, _ = TipoProducto.objects.get_or_create(nombre_tipo="Teclado")
    tipo_silla, _ = TipoProducto.objects.get_or_create(nombre_tipo="Silla")
    tipo_notebook, _ = TipoProducto.objects.get_or_create(nombre_tipo="Notebook")
    tipo_software, _ = TipoProducto.objects.get_or_create(nombre_tipo="Software")
    tipo_servicio, _ = TipoProducto.objects.get_or_create(nombre_tipo="Servicio")
    tipo_st, _ = TipoProducto.objects.get_or_create(nombre_tipo="Servicio TechTower")
    
    print("Creando Productos...")
    
    productos_a_crear = [
    # ============ PROCESADORES (CPUs) ============
    {
        "nombre_producto": "Procesador AMD Ryzen 7 7800X3D",
        "marca_producto": "AMD",
        "descripcion_producto": "8 núcleos, 16 hilos, 5.0 GHz Boost, Socket AM5, 3D V-Cache",
        "precio_transferencia": 389990,
        "precio_otro": 407990,
        "stock_producto": 15,
        "categoria": cat_componentes,
        "tipo": tipo_cpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/tbbzah2z_5a4e67f8_thumbnail_512.jpg",
        "watts": 120,
        "es_destacado": True,
        "descuento": 5
    },
    {
        "nombre_producto": "Procesador Intel Core i9-14900K",
        "marca_producto": "INTEL",
        "descripcion_producto": "24 núcleos, 32 hilos, 6.0 GHz Turbo, Socket LGA1700",
        "precio_transferencia": 549990,
        "precio_otro": 574990,
        "stock_producto": 10,
        "categoria": cat_componentes,
        "tipo": tipo_cpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/kpnroeay_d7ec5275_thumbnail_512.jpg",
        "watts": 253,
        "es_destacado": True,
        "descuento": 0
    },
    {
        "nombre_producto": "Procesador AMD Ryzen 5 7600X",
        "marca_producto": "AMD",
        "descripcion_producto": "6 núcleos, 12 hilos, 5.3 GHz Boost, Socket AM5",
        "precio_transferencia": 189990,
        "precio_otro": 198990,
        "stock_producto": 25,
        "categoria": cat_componentes,
        "tipo": tipo_cpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/4cw81vnj_88e8d78b_thumbnail_512.jpg",
        "watts": 105
    },
    {
        "nombre_producto": "Procesador Intel Core i5-13600K",
        "marca_producto": "INTEL",
        "descripcion_producto": "14 núcleos, 20 hilos, 5.1 GHz Turbo, Socket LGA1700",
        "precio_transferencia": 279990,
        "precio_otro": 292990,
        "stock_producto": 18,
        "categoria": cat_componentes,
        "tipo": tipo_cpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/hkm7gpft_ab95f06a_thumbnail_512.jpg",
        "watts": 181
    },
    {
        "nombre_producto": "Procesador AMD Ryzen 9 7950X",
        "marca_producto": "AMD",
        "descripcion_producto": "16 núcleos, 32 hilos, 5.7 GHz Boost, Socket AM5",
        "precio_transferencia": 529990,
        "precio_otro": 554990,
        "stock_producto": 8,
        "categoria": cat_componentes,
        "tipo": tipo_cpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/3rp3m9ia_2c21e37a_thumbnail_512.jpg",
        "watts": 170,
        "es_destacado": True
    },

    # ============ TARJETAS GRÁFICAS (GPUs) ============
    {
        "nombre_producto": "Tarjeta Gráfica RTX 4090 24GB",
        "marca_producto": "NVIDIA",
        "descripcion_producto": "24GB GDDR6X, Ray Tracing, DLSS 3.5, Ada Lovelace",
        "precio_transferencia": 1899990,
        "precio_otro": 1984990,
        "stock_producto": 5,
        "categoria": cat_componentes,
        "tipo": tipo_gpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/3rvwvgqp_5a1fde65_thumbnail_512.jpg",
        "watts": 450,
        "es_destacado": True,
        "descuento": 3
    },
    {
        "nombre_producto": "Tarjeta Gráfica RTX 4070 Ti SUPER 16GB",
        "marca_producto": "NVIDIA",
        "descripcion_producto": "16GB GDDR6X, Ray Tracing, DLSS 3",
        "precio_transferencia": 849990,
        "precio_otro": 888990,
        "stock_producto": 12,
        "categoria": cat_componentes,
        "tipo": tipo_gpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/lyfvhznb_f6fa9f45_thumbnail_512.jpg",
        "watts": 285,
        "es_destacado": True
    },
    {
        "nombre_producto": "Tarjeta Gráfica RX 7900 XTX 24GB",
        "marca_producto": "AMD",
        "descripcion_producto": "24GB GDDR6, RDNA 3, Ray Tracing",
        "precio_transferencia": 949990,
        "precio_otro": 992990,
        "stock_producto": 10,
        "categoria": cat_componentes,
        "tipo": tipo_gpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/b4bj2w0z_64cad66f_thumbnail_512.jpg",
        "watts": 355,
        "es_destacado": True
    },
    {
        "nombre_producto": "Tarjeta Gráfica RTX 4060 Ti 8GB",
        "marca_producto": "NVIDIA",
        "descripcion_producto": "8GB GDDR6, Ray Tracing, DLSS 3",
        "precio_transferencia": 429990,
        "precio_otro": 449990,
        "stock_producto": 20,
        "categoria": cat_componentes,
        "tipo": tipo_gpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/k7qmgm7p_3c9d12b8_thumbnail_512.jpg",
        "watts": 160
    },
    {
        "nombre_producto": "Tarjeta Gráfica RX 7600 8GB",
        "marca_producto": "AMD",
        "descripcion_producto": "8GB GDDR6, RDNA 3, 1080p Gaming",
        "precio_transferencia": 289990,
        "precio_otro": 303490,
        "stock_producto": 22,
        "categoria": cat_componentes,
        "tipo": tipo_gpu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/rxs3vjcn_aa2e3d95_thumbnail_512.jpg",
        "watts": 165
    },

    # ============ MEMORIAS RAM ============
    {
        "nombre_producto": "Memoria RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
        "marca_producto": "CORSAIR",
        "descripcion_producto": "32GB DDR5, 6000MHz, RGB, CL30, Intel XMP 3.0",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 30,
        "categoria": cat_componentes,
        "tipo": tipo_ram,
        "imagen": "https://media.spdigital.cl/thumbnails/products/odhqeadr_e95e6e3e_thumbnail_512.jpg",
        "es_destacado": True,
        "descuento": 10
    },
    {
        "nombre_producto": "Memoria RAM G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz",
        "marca_producto": "G.SKILL",
        "descripcion_producto": "64GB DDR5, 6400MHz, RGB, CL32",
        "precio_transferencia": 249990,
        "precio_otro": 261490,
        "stock_producto": 15,
        "categoria": cat_componentes,
        "tipo": tipo_ram,
        "imagen": "https://media.spdigital.cl/thumbnails/products/trvwfp5z_e1d2558b_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Memoria RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz",
        "marca_producto": "KINGSTON",
        "descripcion_producto": "16GB DDR4, 3200MHz, CL16, Intel XMP",
        "precio_transferencia": 42990,
        "precio_otro": 44949,
        "stock_producto": 50,
        "categoria": cat_componentes,
        "tipo": tipo_ram,
        "imagen": "https://media.spdigital.cl/thumbnails/products/r8dnasut_a9b43fd5_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Memoria RAM Crucial 32GB (2x16GB) DDR5 5600MHz",
        "marca_producto": "CRUCIAL",
        "descripcion_producto": "32GB DDR5, 5600MHz, CL46, sin RGB",
        "precio_transferencia": 99990,
        "precio_otro": 104490,
        "stock_producto": 35,
        "categoria": cat_componentes,
        "tipo": tipo_ram,
        "imagen": "https://media.spdigital.cl/thumbnails/products/h6g9l9re_06b3c516_thumbnail_512.jpg"
    },

    # ============ PLACAS MADRE ============
    {
        "nombre_producto": "Placa Madre ASUS ROG Strix X670E-E Gaming WiFi",
        "marca_producto": "ASUS",
        "descripcion_producto": "Socket AM5, DDR5, PCIe 5.0, WiFi 6E, USB 4.0",
        "precio_transferencia": 419990,
        "precio_otro": 438890,
        "stock_producto": 12,
        "categoria": cat_componentes,
        "tipo": tipo_pm,
        "imagen": "https://media.spdigital.cl/thumbnails/products/ibtk5lh9_f9e8bbc6_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Placa Madre MSI MAG B650 Tomahawk WiFi",
        "marca_producto": "MSI",
        "descripcion_producto": "Socket AM5, DDR5, PCIe 4.0, WiFi 6E",
        "precio_transferencia": 229990,
        "precio_otro": 240290,
        "stock_producto": 18,
        "categoria": cat_componentes,
        "tipo": tipo_pm,
        "imagen": "https://media.spdigital.cl/thumbnails/products/bnxr5tke_ab08fc71_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Placa Madre Gigabyte Z790 AORUS Elite AX",
        "marca_producto": "GIGABYTE",
        "descripcion_producto": "Socket LGA1700, DDR5, PCIe 5.0, WiFi 6E",
        "precio_transferencia": 289990,
        "precio_otro": 303090,
        "stock_producto": 15,
        "categoria": cat_componentes,
        "tipo": tipo_pm,
        "imagen": "https://media.spdigital.cl/thumbnails/products/vl41amog_5e7d8a94_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Placa Madre ASRock B760M Pro RS",
        "marca_producto": "ASROCK",
        "descripcion_producto": "Socket LGA1700, DDR5, Micro-ATX, PCIe 4.0",
        "precio_transferencia": 139990,
        "precio_otro": 146190,
        "stock_producto": 25,
        "categoria": cat_componentes,
        "tipo": tipo_pm,
        "imagen": "https://media.spdigital.cl/thumbnails/products/kvcgzz_be6fa8fb_thumbnail_512.jpg"
    },

    # ============ FUENTES DE PODER (PSU) ============
    {
        "nombre_producto": "Fuente de Poder Corsair RM1000e 1000W 80 Plus Gold",
        "marca_producto": "CORSAIR",
        "descripcion_producto": "1000W, 80 Plus Gold, Full Modular, ATX 3.0",
        "precio_transferencia": 169990,
        "precio_otro": 177690,
        "stock_producto": 20,
        "categoria": cat_componentes,
        "tipo": tipo_psu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/1yq8x5m__aa68b45b_thumbnail_512.jpg",
        "watts": 1000,
        "es_destacado": True
    },
    {
        "nombre_producto": "Fuente de Poder EVGA SuperNOVA 850 GT 850W 80 Plus Gold",
        "marca_producto": "EVGA",
        "descripcion_producto": "850W, 80 Plus Gold, Full Modular",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 22,
        "categoria": cat_componentes,
        "tipo": tipo_psu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/eqgjqrj2_785ce831_thumbnail_512.jpg",
        "watts": 850
    },
    {
        "nombre_producto": "Fuente de Poder Thermaltake Toughpower GF3 750W 80 Plus Gold",
        "marca_producto": "THERMALTAKE",
        "descripcion_producto": "750W, 80 Plus Gold, Full Modular, ATX 3.0",
        "precio_transferencia": 109990,
        "precio_otro": 114990,
        "stock_producto": 28,
        "categoria": cat_componentes,
        "tipo": tipo_psu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/fvtnhgv6_9c5ef4de_thumbnail_512.jpg",
        "watts": 750
    },
    {
        "nombre_producto": "Fuente de Poder Cooler Master MWE 650W 80 Plus Bronze",
        "marca_producto": "COOLER MASTER",
        "descripcion_producto": "650W, 80 Plus Bronze, Semi Modular",
        "precio_transferencia": 59990,
        "precio_otro": 62690,
        "stock_producto": 35,
        "categoria": cat_componentes,
        "tipo": tipo_psu,
        "imagen": "https://media.spdigital.cl/thumbnails/products/s9v0stbe_dbc95e3c_thumbnail_512.jpg",
        "watts": 650
    },

    # ============ ALMACENAMIENTO (SSD) ============
    {
        "nombre_producto": "SSD Samsung 990 PRO 2TB NVMe M.2 Gen4",
        "marca_producto": "SAMSUNG",
        "descripcion_producto": "2TB, NVMe PCIe 4.0, 7450MB/s lectura, con disipador",
        "precio_transferencia": 179990,
        "precio_otro": 188190,
        "stock_producto": 25,
        "categoria": cat_componentes,
        "tipo": tipo_ssd,
        "imagen": "https://media.spdigital.cl/thumbnails/products/eajynmqg_e35e6f0b_thumbnail_512.jpg",
        "es_destacado": True,
        "descuento": 8
    },
    {
        "nombre_producto": "SSD WD Black SN850X 1TB NVMe M.2 Gen4",
        "marca_producto": "WESTERN DIGITAL",
        "descripcion_producto": "1TB, NVMe PCIe 4.0, 7300MB/s lectura",
        "precio_transferencia": 99990,
        "precio_otro": 104490,
        "stock_producto": 30,
        "categoria": cat_componentes,
        "tipo": tipo_ssd,
        "imagen": "https://media.spdigital.cl/thumbnails/products/6rlpekzj_9b46f34b_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "SSD Crucial P3 Plus 4TB NVMe M.2 Gen4",
        "marca_producto": "CRUCIAL",
        "descripcion_producto": "4TB, NVMe PCIe 4.0, 5000MB/s lectura",
        "precio_transferencia": 259990,
        "precio_otro": 271790,
        "stock_producto": 15,
        "categoria": cat_componentes,
        "tipo": tipo_ssd,
        "imagen": "https://media.spdigital.cl/thumbnails/products/l3zpgn7i_07e4cb95_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "SSD Kingston NV2 500GB NVMe M.2 Gen4",
        "marca_producto": "KINGSTON",
        "descripcion_producto": "500GB, NVMe PCIe 4.0, 3500MB/s lectura",
        "precio_transferencia": 34990,
        "precio_otro": 36590,
        "stock_producto": 45,
        "categoria": cat_componentes,
        "tipo": tipo_ssd,
        "imagen": "https://media.spdigital.cl/thumbnails/products/jhcaxrnj_1c9b3ea9_thumbnail_512.jpg"
    },

    # ============ GABINETES ============
    {
        "nombre_producto": "Gabinete Corsair 5000D Airflow Tempered Glass",
        "marca_producto": "CORSAIR",
        "descripcion_producto": "Mid Tower, ATX, Vidrio Templado, 4 Ventiladores",
        "precio_transferencia": 149990,
        "precio_otro": 156890,
        "stock_producto": 12,
        "categoria": cat_componentes,
        "tipo": tipo_gabinete,
        "imagen": "https://media.spdigital.cl/thumbnails/products/q5shnznf_fc1be7b6_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Gabinete NZXT H7 Flow RGB",
        "marca_producto": "NZXT",
        "descripcion_producto": "Mid Tower, ATX, Vidrio Templado, RGB, 3 Ventiladores",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 15,
        "categoria": cat_componentes,
        "tipo": tipo_gabinete,
        "imagen": "https://media.spdigital.cl/thumbnails/products/jcgk0kvv_b8f3e2a9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Gabinete Lian Li Lancool 216 RGB",
        "marca_producto": "LIAN LI",
        "descripcion_producto": "Mid Tower, ATX, Vidrio Templado, 2 Ventiladores RGB",
        "precio_transferencia": 119990,
        "precio_otro": 125490,
        "stock_producto": 18,
        "categoria": cat_componentes,
        "tipo": tipo_gabinete,
        "imagen": "https://media.spdigital.cl/thumbnails/products/8gjujqp8_c9a5d741_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Gabinete Cooler Master MasterBox Q300L",
        "marca_producto": "COOLER MASTER",
        "descripcion_producto": "Micro-ATX, Compact, Ventilador trasero incluido",
        "precio_transferencia": 54990,
        "precio_otro": 57490,
        "stock_producto": 25,
        "categoria": cat_componentes,
        "tipo": tipo_gabinete,
        "imagen": "https://media.spdigital.cl/thumbnails/products/nxruz2qe_d4e81c6f_thumbnail_512.jpg"
    },

    # ============ REFRIGERACIÓN LÍQUIDA ============
    {
        "nombre_producto": "Refrigeración Líquida Corsair iCUE H150i Elite LCD 360mm",
        "marca_producto": "CORSAIR",
        "descripcion_producto": "AIO 360mm, LCD Display, RGB, Socket AM5/LGA1700",
        "precio_transferencia": 249990,
        "precio_otro": 261490,
        "stock_producto": 10,
        "categoria": cat_componentes,
        "tipo": tipo_rf,
        "imagen": "https://media.spdigital.cl/thumbnails/products/u_eyyb2x_8d3fc694_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Refrigeración Líquida NZXT Kraken Elite 280mm RGB",
        "marca_producto": "NZXT",
        "descripcion_producto": "AIO 280mm, LCD Display, RGB, Socket AM5/LGA1700",
        "precio_transferencia": 219990,
        "precio_otro": 229990,
        "stock_producto": 12,
        "categoria": cat_componentes,
        "tipo": tipo_rf,
        "imagen": "https://media.spdigital.cl/thumbnails/products/m_jw2y3f_5b6e47a3_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Refrigeración Líquida Cooler Master MasterLiquid 240L V2 RGB",
        "marca_producto": "COOLER MASTER",
        "descripcion_producto": "AIO 240mm, RGB, Socket AM5/LGA1700",
        "precio_transferencia": 89990,
        "precio_otro": 94090,
        "stock_producto": 20,
        "categoria": cat_componentes,
        "tipo": tipo_rf,
        "imagen": "https://media.spdigital.cl/thumbnails/products/ljbj7gog_7e9c3b52_thumbnail_512.jpg"
    },

    # ============ MONITORES ============
    {
        "nombre_producto": "Monitor LG UltraGear 27GP850-B 27' 2K 165Hz IPS",
        "marca_producto": "LG",
        "descripcion_producto": "27', 2560x1440, 165Hz, 1ms, IPS, G-Sync Compatible",
        "precio_transferencia": 329990,
        "precio_otro": 344990,
        "stock_producto": 15,
        "categoria": cat_gaming,
        "tipo": tipo_monitor,
        "imagen": "https://media.spdigital.cl/thumbnails/products/z7nrfofz_f8c2d5b6_thumbnail_512.jpg",
        "es_destacado": True,
        "descuento": 12
    },
    {
        "nombre_producto": "Monitor ASUS TUF Gaming VG27AQ 27' 2K 165Hz IPS",
        "marca_producto": "ASUS",
        "descripcion_producto": "27', 2560x1440, 165Hz, 1ms, IPS, G-Sync",
        "precio_transferencia": 299990,
        "precio_otro": 313490,
        "stock_producto": 18,
        "categoria": cat_gaming,
        "tipo": tipo_monitor,
        "imagen": "https://media.spdigital.cl/thumbnails/products/5a6f73vx_cf9e6ba8_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Monitor Samsung Odyssey G5 34' UltraWide 165Hz VA",
        "marca_producto": "SAMSUNG",
        "descripcion_producto": "34', 3440x1440, 165Hz, 1ms, VA Curved, FreeSync Premium",
        "precio_transferencia": 449990,
        "precio_otro": 470290,
        "stock_producto": 10,
        "categoria": cat_gaming,
        "tipo": tipo_monitor,
        "imagen": "https://media.spdigital.cl/thumbnails/products/1nnwx1jp_a9e5c7d3_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Monitor AOC 24G2 24' Full HD 144Hz IPS",
        "marca_producto": "AOC",
        "descripcion_producto": "24', 1920x1080, 144Hz, 1ms, IPS, FreeSync",
        "precio_transferencia": 149990,
        "precio_otro": 156890,
        "stock_producto": 25,
        "categoria": cat_gaming,
        "tipo": tipo_monitor,
        "imagen": "https://media.spdigital.cl/thumbnails/products/y2fk2aqf_b6d3e9a7_thumbnail_512.jpg"
    },

    # ============ TECLADOS ============
    {
        "nombre_producto": "Teclado Mecánico Logitech G Pro X TKL Lightspeed Wireless",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "Mecánico, TKL, Wireless, RGB, Switch GX Blue",
        "precio_transferencia": 149990,
        "precio_otro": 156890,
        "stock_producto": 20,
        "categoria": cat_gaming,
        "tipo": tipo_teclado,
        "imagen": "https://media.spdigital.cl/thumbnails/products/fqonmsj7_e3c9f5b8_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Teclado Mecánico Razer BlackWidow V4 Pro",
        "marca_producto": "RAZER",
        "descripcion_producto": "Mecánico, Full Size, RGB Chroma, Switch Green, Reposamuñecas",
        "precio_transferencia": 199990,
        "precio_otro": 208990,
        "stock_producto": 15,
        "categoria": cat_gaming,
        "tipo": tipo_teclado,
        "imagen": "https://media.spdigital.cl/thumbnails/products/c5z2xtei_9a7f6b4e_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Teclado Mecánico HyperX Alloy Origins Core TKL",
        "marca_producto": "HYPERX",
        "descripcion_producto": "Mecánico, TKL, RGB, Switch HyperX Red",
        "precio_transferencia": 89990,
        "precio_otro": 94090,
        "stock_producto": 30,
        "categoria": cat_gaming,
        "tipo": tipo_teclado,
        "imagen": "https://media.spdigital.cl/thumbnails/products/8bg4vfvx_c4e8f6a9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Teclado Redragon Kumara K552 RGB",
        "marca_producto": "REDRAGON",
        "descripcion_producto": "Mecánico, TKL, RGB, Switch Blue, Budget",
        "precio_transferencia": 34990,
        "precio_otro": 36590,
        "stock_producto": 40,
        "categoria": cat_gaming,
        "tipo": tipo_teclado,
        "imagen": "https://media.spdigital.cl/thumbnails/products/llqoitma_b8f5c3d7_thumbnail_512.jpg"
    },

    # ============ MOUSE ============
    {
        "nombre_producto": "Mouse Logitech G Pro X Superlight 2 Wireless",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "Wireless, 32000 DPI, 60g, HERO 2 Sensor, RGB",
        "precio_transferencia": 149990,
        "precio_otro": 156890,
        "stock_producto": 25,
        "categoria": cat_gaming,
        "tipo": tipo_mouse,
        "imagen": "https://media.spdigital.cl/thumbnails/products/ijuexqk4_d7e9f3b5_thumbnail_512.jpg",
        "es_destacado": True,
        "descuento": 10
    },
    {
        "nombre_producto": "Mouse Razer DeathAdder V3 Pro Wireless",
        "marca_producto": "RAZER",
        "descripcion_producto": "Wireless, 30000 DPI, Focus Pro 30K Sensor, 63g",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 22,
        "categoria": cat_gaming,
        "tipo": tipo_mouse,
        "imagen": "https://media.spdigital.cl/thumbnails/products/snvbz5ca_a8f6c4e9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Mouse SteelSeries Rival 3 Wireless",
        "marca_producto": "STEELSERIES",
        "descripcion_producto": "Wireless, 18000 DPI, TrueMove Air Sensor, 96g",
        "precio_transferencia": 54990,
        "precio_otro": 57490,
        "stock_producto": 35,
        "categoria": cat_gaming,
        "tipo": tipo_mouse,
        "imagen": "https://images.ctfassets.net/w5r1fvmogo3f/1634RpVgtwGZSQ0G1QraNx/0751d91623e8e89284ad0d5e139fcda6/rival_3_wl_gen_2_black_pdp_img_buy_05.png?fm=webp&q=90&fit=scale&w=1920"
    },
    {
        "nombre_producto": "Mouse Logitech G305 Lightspeed Wireless",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "Wireless, 12000 DPI, HERO Sensor, 99g con batería",
        "precio_transferencia": 39990,
        "precio_otro": 41790,
        "stock_producto": 45,
        "categoria": cat_gaming,
        "tipo": tipo_mouse,
        "imagen": "https://media.spdigital.cl/thumbnails/products/7xmfbqp4_c9e5f7a8_thumbnail_512.jpg"
    },

    # ============ AUDÍFONOS ============
    {
        "nombre_producto": "Audífonos HyperX Cloud III Wireless",
        "marca_producto": "HYPERX",
        "descripcion_producto": "Gaming, Wireless 2.4GHz, 120hrs batería, DTS Spatial",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 20,
        "categoria": cat_audio,
        "tipo": tipo_audifonos,
        "imagen": "https://media.spdigital.cl/thumbnails/products/n8qjvfr2_d7e8f4b9_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Audífonos SteelSeries Arctis Nova Pro Wireless",
        "marca_producto": "STEELSERIES",
        "descripcion_producto": "Gaming, Wireless Multi-plataforma, ANC, GameDAC",
        "precio_transferencia": 329990,
        "precio_otro": 344990,
        "stock_producto": 12,
        "categoria": cat_audio,
        "tipo": tipo_audifonos,
        "imagen": "https://media.spdigital.cl/thumbnails/products/k5zgmqn7_b9f6c3e8_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Audífonos Logitech G733 Lightspeed Wireless RGB",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "Gaming, Wireless, RGB, 29hrs batería, 278g",
        "precio_transferencia": 99990,
        "precio_otro": 104490,
        "stock_producto": 25,
        "categoria": cat_audio,
        "tipo": tipo_audifonos,
        "imagen": "https://media.spdigital.cl/thumbnails/products/p3mjrtz8_f8c5e7a9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Audífonos Razer BlackShark V2 Pro Wireless",
        "marca_producto": "RAZER",
        "descripcion_producto": "Gaming, Wireless, THX Spatial Audio, 70hrs batería",
        "precio_transferencia": 149990,
        "precio_otro": 156890,
        "stock_producto": 18,
        "categoria": cat_audio,
        "tipo": tipo_audifonos,
        "imagen": "https://media.spdigital.cl/thumbnails/products/q9tjvbx4_a8f7c6e9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Audífonos Inalámbricos JBL Wave Buds",
        "marca_producto": "JBL",
        "descripcion_producto": "TWS Bluetooth 5.2, IPX2, 32hrs batería total",
        "precio_transferencia": 50000,
        "precio_otro": 52260,
        "stock_producto": 30,
        "categoria": cat_audio,
        "tipo": tipo_audifonos,
        "imagen": "https://media.spdigital.cl/thumbnails/products/298ynsi0_34010889_thumbnail_512.jpg",
        "descuento": 15
    },

    # ============ MICRÓFONOS ============
    {
        "nombre_producto": "Micrófono HyperX QuadCast S RGB USB",
        "marca_producto": "HYPERX",
        "descripcion_producto": "USB Condenser, RGB, Anti-vibración, 4 patrones polares",
        "precio_transferencia": 129990,
        "precio_otro": 135890,
        "stock_producto": 15,
        "categoria": cat_audio,
        "tipo": tipo_microfono,
        "imagen": "https://media.spdigital.cl/thumbnails/products/r7pkzqm3_c8f9e5a7_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Micrófono Blue Yeti USB",
        "marca_producto": "BLUE",
        "descripcion_producto": "USB Condenser, 4 patrones polares, Control de ganancia",
        "precio_transferencia": 109990,
        "precio_otro": 114990,
        "stock_producto": 18,
        "categoria": cat_audio,
        "tipo": tipo_microfono,
        "imagen": "https://media.spdigital.cl/thumbnails/products/t4njxbp9_f7e8c6a9_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Micrófono Razer Seiren Mini USB",
        "marca_producto": "RAZER",
        "descripcion_producto": "USB Condenser Compacto, Patrón supercardioide",
        "precio_transferencia": 49990,
        "precio_otro": 52240,
        "stock_producto": 25,
        "categoria": cat_audio,
        "tipo": tipo_microfono,
        "imagen": "https://media.spdigital.cl/thumbnails/products/m8qjvfx5_a9f7c8e6_thumbnail_512.jpg"
    },

    # ============ PARLANTES ============
    {
        "nombre_producto": "Parlantes Logitech G560 Lightsync RGB 2.1",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "2.1, 240W, RGB Lightsync, DTS:X Ultra",
        "precio_transferencia": 199990,
        "precio_otro": 208990,
        "stock_producto": 10,
        "categoria": cat_audio,
        "tipo": tipo_parlante,
        "imagen": "https://media.spdigital.cl/thumbnails/products/s6mjqbz7_e8f9c7a6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Parlante Portátil JBL Go 3",
        "marca_producto": "JBL",
        "descripcion_producto": "Bluetooth, IP67, 5hrs batería, Compacto",
        "precio_transferencia": 42990,
        "precio_otro": 44920,
        "stock_producto": 25,
        "categoria": cat_audio,
        "tipo": tipo_parlante,
        "imagen": "https://media.spdigital.cl/thumbnails/products/26bb6pix_386bdef3_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Parlante JBL Flip 6 Bluetooth",
        "marca_producto": "JBL",
        "descripcion_producto": "Bluetooth 5.1, IP67, 12hrs batería, 30W",
        "precio_transferencia": 89990,
        "precio_otro": 94090,
        "stock_producto": 20,
        "categoria": cat_audio,
        "tipo": tipo_parlante,
        "imagen": "https://media.spdigital.cl/thumbnails/products/j9pkxqv4_f8c7e9a6_thumbnail_512.jpg"
    },

    # ============ SILLAS GAMER ============
    {
        "nombre_producto": "Silla Gamer Cooler Master Caliber R2",
        "marca_producto": "COOLER MASTER",
        "descripcion_producto": "Ergonómica, Cuero PU, Reclinable 180°, Hasta 120kg",
        "precio_transferencia": 229990,
        "precio_otro": 240290,
        "stock_producto": 8,
        "categoria": cat_gaming,
        "tipo": tipo_silla,
        "imagen": "https://media.spdigital.cl/thumbnails/products/n7mjpqx8_c9f8e7a6_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Silla Gamer DXRacer Formula Series",
        "marca_producto": "DXRACER",
        "descripcion_producto": "Ergonómica, Cuero sintético, Cojines lumbar y cervical",
        "precio_transferencia": 279990,
        "precio_otro": 292490,
        "stock_producto": 6,
        "categoria": cat_gaming,
        "tipo": tipo_silla,
        "imagen": "https://media.spdigital.cl/thumbnails/products/p8tjvbx5_f7e9c8a6_thumbnail_512.jpg"
    },

    # ============ NOTEBOOKS ============
    {
        "nombre_producto": "Notebook ASUS ROG Strix G16 RTX 4060",
        "marca_producto": "ASUS",
        "descripcion_producto": "i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, 16' 165Hz",
        "precio_transferencia": 1299990,
        "precio_otro": 1358990,
        "stock_producto": 5,
        "categoria": cat_computacion,
        "tipo": tipo_notebook,
        "imagen": "https://media.spdigital.cl/thumbnails/products/k8mjqvx7_a9f8c7e6_thumbnail_512.jpg",
        "es_destacado": True,
        "descuento": 5
    },
    {
        "nombre_producto": "Notebook MSI Katana 15 RTX 4050",
        "marca_producto": "MSI",
        "descripcion_producto": "i5-13420H, RTX 4050 6GB, 16GB RAM, 512GB SSD, 15.6' 144Hz",
        "precio_transferencia": 899990,
        "precio_otro": 940990,
        "stock_producto": 8,
        "categoria": cat_computacion,
        "tipo": tipo_notebook,
        "imagen": "https://media.spdigital.cl/thumbnails/products/m9pjxqz4_f8c9e7a6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Notebook Lenovo LOQ 15 RTX 3050",
        "marca_producto": "LENOVO",
        "descripcion_producto": "i5-12450H, RTX 3050 4GB, 16GB RAM, 512GB SSD, 15.6' 144Hz",
        "precio_transferencia": 699990,
        "precio_otro": 731990,
        "stock_producto": 10,
        "categoria": cat_computacion,
        "tipo": tipo_notebook,
        "imagen": "https://media.spdigital.cl/thumbnails/products/q7njvbx8_c9f8e7a6_thumbnail_512.jpg"
    },

    # ============ CONECTIVIDAD Y ACCESORIOS ============
    {
        "nombre_producto": "Access Point de Pared Omada EAP235",
        "marca_producto": "TP-LINK",
        "descripcion_producto": "AC1200 Dual Band, PoE, Montaje en pared",
        "precio_transferencia": 67990,
        "precio_otro": 71045,
        "stock_producto": 15,
        "categoria": cat_conectividad,
        "tipo": tipo_ap,
        "imagen": "https://media.spdigital.cl/thumbnails/products/vp9gblsx_a39cdb5f_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Router TP-Link Archer AX55 AX3000 WiFi 6",
        "marca_producto": "TP-LINK",
        "descripcion_producto": "WiFi 6, Dual Band, 4 antenas, hasta 3Gbps",
        "precio_transferencia": 89990,
        "precio_otro": 94090,
        "stock_producto": 20,
        "categoria": cat_conectividad,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/t8mjqvx9_f7e9c8a6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Cable de Alimentación C14 Macho a C13 Hembra",
        "marca_producto": "TRIPP LITE",
        "descripcion_producto": "Cable de poder estándar, 1.8m",
        "precio_transferencia": 1310,
        "precio_otro": 2410,
        "stock_producto": 20,
        "categoria": cat_conectividad,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/c2zlalo0_0ec8bf20_thumbnail_512.jpg",
        "descuento": 10
    },
    {
        "nombre_producto": "Hub USB 3.0 de 7 Puertos con Alimentación",
        "marca_producto": "ANKER",
        "descripcion_producto": "7 puertos USB 3.0, 5Gbps, incluye adaptador",
        "precio_transferencia": 29990,
        "precio_otro": 31340,
        "stock_producto": 30,
        "categoria": cat_conectividad,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/p9mjvqx7_c8f9e7a6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Webcam Logitech C920 HD Pro",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "1080p 30fps, Autofocus, Micrófono estéreo",
        "precio_transferencia": 69990,
        "precio_otro": 73140,
        "stock_producto": 25,
        "categoria": cat_gaming,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/k8mjvqx5_f9c8e7a6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Mousepad Logitech G840 XL",
        "marca_producto": "LOGITECH",
        "descripcion_producto": "Gaming, 900x400x3mm, Superficie de tela, Base de goma",
        "precio_transferencia": 34990,
        "precio_otro": 36590,
        "stock_producto": 40,
        "categoria": cat_gaming,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/m7njvbx9_a8f9c7e6_thumbnail_512.jpg"
    },
    {
        "nombre_producto": "Capturadora Elgato HD60 S+",
        "marca_producto": "ELGATO",
        "descripcion_producto": "1080p60 HDR10, USB 3.0, Streaming y grabación",
        "precio_transferencia": 189990,
        "precio_otro": 198490,
        "stock_producto": 12,
        "categoria": cat_gaming,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/q9mjvqx8_f8c9e7a6_thumbnail_512.jpg",
        "es_destacado": True
    },
    {
        "nombre_producto": "Ventiladores RGB Cooler Master MasterFan MF120 Halo Pack x3",
        "marca_producto": "COOLER MASTER",
        "descripcion_producto": "3x 120mm, RGB ARGB, 1800 RPM, Silenciosos",
        "precio_transferencia": 54990,
        "precio_otro": 57490,
        "stock_producto": 22,
        "categoria": cat_componentes,
        "tipo": tipo_acceseorio,
        "imagen": "https://media.spdigital.cl/thumbnails/products/t8njvbx7_c9f8e7a6_thumbnail_512.jpg"
    }
]

    # Usamos get_or_create para evitar duplicados si la migración se corre de nuevo
    for prod_data in productos_a_crear:
        Producto.objects.get_or_create(nombre_producto=prod_data["nombre_producto"], defaults=prod_data)

    print("Creando Órdenes...")
    
    # Obtenemos el superusuario que ya debería existir
    try:
        admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        admin_user = User.objects.get(email=admin_email)
    except User.DoesNotExist:
        print(f"ADVERTENCIA: No se encontró el superusuario {admin_email}. Las órdenes no se crearán!")
        return # No podemos continuar si no hay usuario
    
    def calcular_precio_final(producto):
        """
        Re-implementa la lógica de @property DENTRO de la migración.
        """
        # Aseguramos que los valores no sean None
        descuento = producto.descuento or 0
        precio = producto.precio_transferencia or 0
        
        if descuento > 0:
            precio_calc = precio * (1 - (descuento / 100))
            return int(precio_calc)
        return precio

    # Verificamos si ya existen órdenes
    if not Orden.objects.exists():
        print("Creando órdenes de prueba (2022-2025)...")
        try:
            # Obtenemos productos variados para las órdenes
            p1 = Producto.objects.get(nombre_producto="Cable de Alimentación C14 Macho a C13 Hembra")
            p2 = Producto.objects.get(nombre_producto="Audífonos Inalámbricos JBL Wave Buds")
            p3 = Producto.objects.get(nombre_producto="Parlante Portátil JBL Go 3")
            p4 = Producto.objects.get(nombre_producto="Procesador AMD Ryzen 7 7800X3D")
            p5 = Producto.objects.get(nombre_producto="Tarjeta Gráfica RTX 4070 Ti SUPER 16GB")
            p6 = Producto.objects.get(nombre_producto="Memoria RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz")
            p7 = Producto.objects.get(nombre_producto="SSD Samsung 990 PRO 2TB NVMe M.2 Gen4")
            p8 = Producto.objects.get(nombre_producto="Monitor LG UltraGear 27GP850-B 27' 2K 165Hz IPS")
            p9 = Producto.objects.get(nombre_producto="Teclado Mecánico Logitech G Pro X TKL Lightspeed Wireless")
            p10 = Producto.objects.get(nombre_producto="Mouse Logitech G Pro X Superlight 2 Wireless")
            p11 = Producto.objects.get(nombre_producto="Fuente de Poder Corsair RM1000e 1000W 80 Plus Gold")
            p12 = Producto.objects.get(nombre_producto="Gabinete Corsair 5000D Airflow Tempered Glass")
            p13 = Producto.objects.get(nombre_producto="Refrigeración Líquida Corsair iCUE H150i Elite LCD 360mm")
            p14 = Producto.objects.get(nombre_producto="Placa Madre ASUS ROG Strix X670E-E Gaming WiFi")
            p15 = Producto.objects.get(nombre_producto="Notebook ASUS ROG Strix G16 RTX 4060")
            
            # ============ ÓRDENES 2022 ============
            # Enero 2022
            orden_1 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p3.calcular_precio_final(p3),
                fecha_orden=date(2022, 1, 12)
            )
            OrdenProducto.objects.create(orden=orden_1, producto=p3, cantidad=1)
            
            # Marzo 2022
            orden_2 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p2.calcular_precio_final(p2) + p1.calcular_precio_final(p1),
                fecha_orden=date(2022, 3, 8)
            )
            OrdenProducto.objects.create(orden=orden_2, producto=p2, cantidad=1)
            OrdenProducto.objects.create(orden=orden_2, producto=p1, cantidad=1)
            
            # Mayo 2022
            orden_3 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p6.calcular_precio_final(p6),
                fecha_orden=date(2022, 5, 20)
            )
            OrdenProducto.objects.create(orden=orden_3, producto=p6, cantidad=1)
            
            # Julio 2022
            orden_4 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='cancelado',
                total_orden=p8.calcular_precio_final(p8),
                fecha_orden=date(2022, 7, 15)
            )
            OrdenProducto.objects.create(orden=orden_4, producto=p8, cantidad=1)
            
            # Septiembre 2022
            orden_5 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p10.calcular_precio_final(p10) + p9.calcular_precio_final(p9),
                fecha_orden=date(2022, 9, 3)
            )
            OrdenProducto.objects.create(orden=orden_5, producto=p10, cantidad=1)
            OrdenProducto.objects.create(orden=orden_5, producto=p9, cantidad=1)
            
            # Noviembre 2022
            orden_6 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p7.calcular_precio_final(p7),
                fecha_orden=date(2022, 11, 25)
            )
            OrdenProducto.objects.create(orden=orden_6, producto=p7, cantidad=1)
            
            # ============ ÓRDENES 2023 ============
            # Enero 2023
            orden_7 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p4.calcular_precio_final(p4) + p14.calcular_precio_final(p14),
                fecha_orden=date(2023, 1, 10)
            )
            OrdenProducto.objects.create(orden=orden_7, producto=p4, cantidad=1)
            OrdenProducto.objects.create(orden=orden_7, producto=p14, cantidad=1)
            
            # Febrero 2023
            orden_8 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p5.calcular_precio_final(p5),
                fecha_orden=date(2023, 2, 14)
            )
            OrdenProducto.objects.create(orden=orden_8, producto=p5, cantidad=1)
            
            # Abril 2023
            orden_9 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='pendiente',
                total_orden=p11.calcular_precio_final(p11) + p12.calcular_precio_final(p12),
                fecha_orden=date(2023, 4, 5)
            )
            OrdenProducto.objects.create(orden=orden_9, producto=p11, cantidad=1)
            OrdenProducto.objects.create(orden=orden_9, producto=p12, cantidad=1)
            
            # Mayo 2023
            orden_10 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p13.calcular_precio_final(p13),
                fecha_orden=date(2023, 5, 22)
            )
            OrdenProducto.objects.create(orden=orden_10, producto=p13, cantidad=1)
            
            # Junio 2023
            orden_11 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p2.calcular_precio_final(p2) * 2,
                fecha_orden=date(2023, 6, 18)
            )
            OrdenProducto.objects.create(orden=orden_11, producto=p2, cantidad=2)
            
            # Agosto 2023
            orden_12 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p8.calcular_precio_final(p8),
                fecha_orden=date(2023, 8, 9)
            )
            OrdenProducto.objects.create(orden=orden_12, producto=p8, cantidad=1)
            
            # Septiembre 2023
            orden_13 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='cancelado',
                total_orden=p15.calcular_precio_final(p15),
                fecha_orden=date(2023, 9, 30)
            )
            OrdenProducto.objects.create(orden=orden_13, producto=p15, cantidad=1)
            
            # Octubre 2023
            orden_14 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p6.calcular_precio_final(p6) + p7.calcular_precio_final(p7),
                fecha_orden=date(2023, 10, 12)
            )
            OrdenProducto.objects.create(orden=orden_14, producto=p6, cantidad=1)
            OrdenProducto.objects.create(orden=orden_14, producto=p7, cantidad=1)
            
            # Diciembre 2023
            orden_15 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p10.calcular_precio_final(p10) + p9.calcular_precio_final(p9) + p3.calcular_precio_final(p3),
                fecha_orden=date(2023, 12, 24)
            )
            OrdenProducto.objects.create(orden=orden_15, producto=p10, cantidad=1)
            OrdenProducto.objects.create(orden=orden_15, producto=p9, cantidad=1)
            OrdenProducto.objects.create(orden=orden_15, producto=p3, cantidad=1)
            
            # ============ ÓRDENES 2024 ============
            # Enero 2024
            orden_16 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p4.calcular_precio_final(p4) + p5.calcular_precio_final(p5) + p6.calcular_precio_final(p6),
                fecha_orden=date(2024, 1, 15)
            )
            OrdenProducto.objects.create(orden=orden_16, producto=p4, cantidad=1)
            OrdenProducto.objects.create(orden=orden_16, producto=p5, cantidad=1)
            OrdenProducto.objects.create(orden=orden_16, producto=p6, cantidad=1)
            
            # Febrero 2024
            orden_17 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p11.calcular_precio_final(p11),
                fecha_orden=date(2024, 2, 20)
            )
            OrdenProducto.objects.create(orden=orden_17, producto=p11, cantidad=1)
            
            # Marzo 2024
            orden_18 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p12.calcular_precio_final(p12) + p13.calcular_precio_final(p13),
                fecha_orden=date(2024, 3, 8)
            )
            OrdenProducto.objects.create(orden=orden_18, producto=p12, cantidad=1)
            OrdenProducto.objects.create(orden=orden_18, producto=p13, cantidad=1)
            
            # Abril 2024
            orden_19 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='pendiente',
                total_orden=p8.calcular_precio_final(p8) * 2,
                fecha_orden=date(2024, 4, 17)
            )
            OrdenProducto.objects.create(orden=orden_19, producto=p8, cantidad=2)
            
            # Mayo 2024
            orden_20 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p7.calcular_precio_final(p7) + p6.calcular_precio_final(p6),
                fecha_orden=date(2024, 5, 25)
            )
            OrdenProducto.objects.create(orden=orden_20, producto=p7, cantidad=1)
            OrdenProducto.objects.create(orden=orden_20, producto=p6, cantidad=1)
            
            # Junio 2024
            orden_21 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p15.calcular_precio_final(p15),
                fecha_orden=date(2024, 6, 10)
            )
            OrdenProducto.objects.create(orden=orden_21, producto=p15, cantidad=1)
            
            # Agosto 2024
            orden_22 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p2.calcular_precio_final(p2) + p3.calcular_precio_final(p3),
                fecha_orden=date(2024, 8, 5)
            )
            OrdenProducto.objects.create(orden=orden_22, producto=p2, cantidad=1)
            OrdenProducto.objects.create(orden=orden_22, producto=p3, cantidad=1)
            
            # Septiembre 2024
            orden_23 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='cancelado',
                total_orden=p5.calcular_precio_final(p5),
                fecha_orden=date(2024, 9, 14)
            )
            OrdenProducto.objects.create(orden=orden_23, producto=p5, cantidad=1)
            
            # Octubre 2024
            orden_24 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p10.calcular_precio_final(p10) * 2,
                fecha_orden=date(2024, 10, 20)
            )
            OrdenProducto.objects.create(orden=orden_24, producto=p10, cantidad=2)
            
            # Noviembre 2024
            orden_25 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p4.calcular_precio_final(p4) + p14.calcular_precio_final(p14) + p6.calcular_precio_final(p6),
                fecha_orden=date(2024, 11, 28)
            )
            OrdenProducto.objects.create(orden=orden_25, producto=p4, cantidad=1)
            OrdenProducto.objects.create(orden=orden_25, producto=p14, cantidad=1)
            OrdenProducto.objects.create(orden=orden_25, producto=p6, cantidad=1)
            
            # Diciembre 2024
            orden_26 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p9.calcular_precio_final(p9) + p10.calcular_precio_final(p10),
                fecha_orden=date(2024, 12, 15)
            )
            OrdenProducto.objects.create(orden=orden_26, producto=p9, cantidad=1)
            OrdenProducto.objects.create(orden=orden_26, producto=p10, cantidad=1)
            
            # ============ ÓRDENES 2025 ============
            # Enero 2025
            orden_27 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p7.calcular_precio_final(p7) * 2,
                fecha_orden=date(2025, 1, 8)
            )
            OrdenProducto.objects.create(orden=orden_27, producto=p7, cantidad=2)
            
            # Febrero 2025
            orden_28 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p5.calcular_precio_final(p5) + p11.calcular_precio_final(p11),
                fecha_orden=date(2025, 2, 14)
            )
            OrdenProducto.objects.create(orden=orden_28, producto=p5, cantidad=1)
            OrdenProducto.objects.create(orden=orden_28, producto=p11, cantidad=1)
            
            # Marzo 2025
            orden_29 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='pendiente',
                total_orden=p15.calcular_precio_final(p15),
                fecha_orden=date(2025, 3, 22)
            )
            OrdenProducto.objects.create(orden=orden_29, producto=p15, cantidad=1)
            
            # Mayo 2025
            orden_30 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p8.calcular_precio_final(p8) + p9.calcular_precio_final(p9) + p10.calcular_precio_final(p10),
                fecha_orden=date(2025, 5, 10)
            )
            OrdenProducto.objects.create(orden=orden_30, producto=p8, cantidad=1)
            OrdenProducto.objects.create(orden=orden_30, producto=p9, cantidad=1)
            OrdenProducto.objects.create(orden=orden_30, producto=p10, cantidad=1)
            
            # Julio 2025
            orden_31 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p4.calcular_precio_final(p4) + p5.calcular_precio_final(p5),
                fecha_orden=date(2025, 7, 4)
            )
            OrdenProducto.objects.create(orden=orden_31, producto=p4, cantidad=1)
            OrdenProducto.objects.create(orden=orden_31, producto=p5, cantidad=1)
            
            # Septiembre 2025
            orden_32 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p2.calcular_precio_final(p2) * 3,
                fecha_orden=date(2025, 9, 18)
            )
            OrdenProducto.objects.create(orden=orden_32, producto=p2, cantidad=3)
            
            # Octubre 2025
            orden_33 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p13.calcular_precio_final(p13) + p12.calcular_precio_final(p12),
                fecha_orden=date(2025, 10, 28)
            )
            OrdenProducto.objects.create(orden=orden_33, producto=p13, cantidad=1)
            OrdenProducto.objects.create(orden=orden_33, producto=p12, cantidad=1)
            
            # Noviembre 2025 - Reciente #1
            orden_34 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='aprobado',
                total_orden=p6.calcular_precio_final(p6) + p7.calcular_precio_final(p7),
                fecha_orden=date(2025, 11, 5)
            )
            OrdenProducto.objects.create(orden=orden_34, producto=p6, cantidad=1)
            OrdenProducto.objects.create(orden=orden_34, producto=p7, cantidad=1)
            
            # Noviembre 2025 - Reciente #2
            orden_35 = Orden.objects.create(
                usuario_orden=admin_user,
                estado_orden='pendiente',
                total_orden=p10.calcular_precio_final(p10) + p9.calcular_precio_final(p9) + p8.calcular_precio_final(p8),
                fecha_orden=date(2025, 11, 15)
            )
            OrdenProducto.objects.create(orden=orden_35, producto=p10, cantidad=1)
            OrdenProducto.objects.create(orden=orden_35, producto=p9, cantidad=1)
            OrdenProducto.objects.create(orden=orden_35, producto=p8, cantidad=1)
            
            print(f"✓ 35 órdenes creadas exitosamente (2022-2025)")
        
        except Producto.DoesNotExist as e:
            print(f"\nADVERTENCIA: No se pudo crear una orden porque el producto no existe: {e}")
            print("Asegúrate de que los nombres en 'Producto.objects.get()' coincidan con 'productos_a_crear'.\n")
    else:
        print("⚠️ Ya existen órdenes en la base de datos, saltando creación.")


class Migration(migrations.Migration):

    dependencies = [
        ('APIbackend', '0018_create_superuser'), 
    ]

    operations = [
        migrations.RunPython(seed_data),
    ]