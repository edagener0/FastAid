from rest_framework import serializers
from .models import Incident
from users.models import Operador
from users.serializers import OperadorSerializer

class IncidentSerializer(serializers.ModelSerializer):
    operadores = OperadorSerializer(many=True, read_only=True)

    class Meta:
        model = Incident
        fields = [
            "id",
            "titulo",
            "descricao",
            "tipo",
            "estado",
            "latitude",
            "longitude",
            "distrito",
            "operadores",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["criado_em", "atualizado_em"]

class IncidentCreateSerializer(serializers.ModelSerializer):
    operadores = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Operador.objects.all(),
        required=False
    )

    class Meta:
        model = Incident
        fields = [
            "titulo",
            "descricao",
            "tipo",
            "latitude",
            "longitude",
            "distrito",
            "operadores",
        ]

    def create(self, validated_data):
        operadores = validated_data.pop("operadores", [])
        incident = Incident.objects.create(**validated_data)
        incident.operadores.set(operadores)
        return incident

class IncidentUpdateSerializer(serializers.ModelSerializer):
    operadores = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Operador.objects.all(),
        required=False
    )

    class Meta:
        model = Incident
        fields = [
            "titulo",
            "descricao",
            "estado",
            "operadores",
        ]
