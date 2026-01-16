from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated

from .models import Incident
from .serializers import (
    IncidentSerializer,
    IncidentCreateSerializer,
    IncidentUpdateSerializer,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Incident

class IncidentListView(ListAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

class IncidentCreateView(CreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentCreateSerializer
    permission_classes = [IsAuthenticated]

class IncidentDetailView(RetrieveAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response

class IncidentUpdateView(UpdateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentUpdateSerializer

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()

        # valida input
        serializer = IncidentUpdateSerializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # responde com serializer COMPLETO
        return Response(IncidentSerializer(instance).data)


class IncidentJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)
        user = request.user

        # Evita BadRequest se o usuário já estiver na lista
        if incident.operadores.filter(pk=user.pk).exists():
            # apenas retorna o serializer sem erro
            serializer = IncidentSerializer(incident, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        incident.operadores.add(user)
        incident.save()

        serializer = IncidentSerializer(incident, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class IncidentLeaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        incident = get_object_or_404(Incident, pk=pk)
        user = request.user

        # Evita BadRequest se o usuário não estiver na lista
        if not incident.operadores.filter(pk=user.pk).exists():
            serializer = IncidentSerializer(incident, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        incident.operadores.remove(user)
        incident.save()

        serializer = IncidentSerializer(incident, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
