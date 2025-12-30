from django.db import models
from users.models import Operador
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Incident(models.Model):

    class Estado(models.TextChoices):
        ABERTA = "ABERTA", "Aberta"
        EM_CURSO = "EM_CURSO", "Em curso"
        RESOLVIDA = "RESOLVIDA", "Resolvida"
        CANCELADA = "CANCELADA", "Cancelada"

    titulo = models.CharField(max_length=100)
    descricao = models.TextField()

    tipo = models.CharField(
        max_length=30,
        choices=Operador.Profissao
    )

    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.ABERTA
    )


    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    distrito = models.CharField(
        max_length=50,
        choices=Operador.Distrito
    )

    #TODO adicionar cliente? 
    
    operadores = models.ManyToManyField(
        User,
        related_name="incidentes",
        blank=True
    )

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titulo} ({self.estado})"
