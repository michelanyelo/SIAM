# Generated by Django 5.0.4 on 2024-04-19 19:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('siam', '0001_initial_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='direccion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='siam.dicpoblaciones'),
        ),
    ]
