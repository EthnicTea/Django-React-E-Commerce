# Generated by Django 5.1.3 on 2024-11-22 19:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('APIbackend', '0005_alter_usuarioapp_apellido_alter_usuarioapp_nombre'),
    ]

    operations = [
        migrations.RenameField(
            model_name='producto',
            old_name='PrecioProducto',
            new_name='PrecioOtroMetodo',
        ),
        migrations.RemoveField(
            model_name='orden',
            name='ProductOrden',
        ),
        migrations.AddField(
            model_name='pago',
            name='Orden',
            field=models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to='APIbackend.orden'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='producto',
            name='CategoriaProducto',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='producto',
            name='ImagenProducto',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='MarcaProducto',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='producto',
            name='PrecioTransferencia',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='orden',
            name='EstadoOrden',
            field=models.CharField(default='Pendiente', max_length=30),
        ),
        migrations.AlterField(
            model_name='orden',
            name='FechaOrden',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='orden',
            name='TotalOrden',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='pago',
            name='FechaPago',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='DescripcionProducto',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='producto',
            name='NomProducto',
            field=models.CharField(max_length=100),
        ),
        migrations.CreateModel(
            name='OrdenProducto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Cantidad', models.PositiveIntegerField(default=1)),
                ('Orden', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='APIbackend.orden')),
                ('Producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='APIbackend.producto')),
            ],
        ),
        migrations.AddField(
            model_name='orden',
            name='Productos',
            field=models.ManyToManyField(through='APIbackend.OrdenProducto', to='APIbackend.producto'),
        ),
    ]