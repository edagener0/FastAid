from rest_framework import serializers
from .models import Operador

class OperadorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operador
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "telefone",
            "profissao",
            "area_preferencia",
        ]

class OperadorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Operador
        fields = (
            "username",
            "first_name",
            "last_name",
            "password",
            "telefone",
            "profissao",
            "area_preferencia",
        )

    def create(self, validated_data):
        user = Operador.objects.create_user(
            username=validated_data["username"],
            telefone=validated_data["telefone"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            profissao=validated_data["profissao"],
            area_preferencia=validated_data["area_preferencia"],
        )
        return user