# Generated by Django 5.1.3 on 2024-11-22 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('APIbackend', '0006_rename_precioproducto_producto_preciootrometodo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='CategoriaProducto',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='producto',
            name='DescripcionProducto',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='producto',
            name='ImagenProducto',
            field=models.URLField(),
        ),
        migrations.AlterField(
            model_name='producto',
            name='MarcaProducto',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='producto',
            name='NomProducto',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='producto',
            name='PrecioOtroMetodo',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='producto',
            name='PrecioTransferencia',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='producto',
            name='StockProducto',
            field=models.IntegerField(),
        ),
    ]
