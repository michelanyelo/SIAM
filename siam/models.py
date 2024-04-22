from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    nacimiento = models.DateField(blank=True, null=True)
    genero = models.CharField(max_length=30, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.ForeignKey(
        'DicPoblaciones', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class DicPoblaciones(models.Model):
    id_poblacion = models.AutoField(primary_key=True)
    id_territorio = models.IntegerField()
    id_uvecinal = models.IntegerField()
    id_comuna = models.SmallIntegerField()
    nombre_uv = models.CharField(max_length=255)
    poblacion = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'dic_poblaciones'

    def __str__(self):
        return f"{self.id_comuna}, {self.poblacion}"
