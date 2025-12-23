from django.contrib.auth.models import AbstractUser
from django.db import models

class Operador(AbstractUser):

    class Profissao(models.TextChoices):
        POLICIA = "POLICIA", "Polícia"
        BOMBEIROS = "BOMBEIROS", "Bombeiros"
        INEM = "INEM", "INEM"
        PROTECAO_CIVIL = "PROTECAO_CIVIL", "Proteção Civil"

    class Distrito(models.TextChoices):
        AVEIRO = "Aveiro", "Aveiro"
        BEJA = "Beja", "Beja"
        BRAGA = "Braga", "Braga"
        BRAGANCA = "Bragança", "Bragança"
        CASTELO_BRANCO = "Castelo Branco", "Castelo Branco"
        COIMBRA = "Coimbra", "Coimbra"
        EVORA = "Évora", "Évora"
        FARO = "Faro", "Faro"
        GUARDA = "Guarda", "Guarda"
        LEIRIA = "Leiria", "Leiria"
        LISBOA = "Lisboa", "Lisboa"
        PORTALEGRE = "Portalegre", "Portalegre"
        PORTO = "Porto", "Porto"
        SANTAREM = "Santarém", "Santarém"
        SETUBAL = "Setúbal", "Setúbal"
        VIANA_DO_CASTELO = "Viana do Castelo", "Viana do Castelo"
        VILA_REAL = "Vila Real", "Vila Real"
        VISEU = "Viseu", "Viseu"
        ACORES = "Açores", "Açores"
        MADEIRA = "Madeira", "Madeira"

    profissao = models.CharField(
        max_length=20,
        choices=Profissao.choices,
        default=Profissao.BOMBEIROS
    )

    area_preferencia = models.CharField(
        max_length=30,
        choices=Distrito.choices,
        default=Distrito.LISBOA
    )

    telefone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username
