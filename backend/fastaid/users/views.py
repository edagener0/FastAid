from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import ListAPIView
from .models import Operador
from .serializers import OperadorDetailSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import OperadorRegisterSerializer


class OperadorDetailView(RetrieveAPIView):
    queryset = Operador.objects.all()
    serializer_class = OperadorDetailSerializer
    permission_classes = [IsAuthenticated]

class OperadorListView(ListAPIView):
    queryset = Operador.objects.all()
    serializer_class = OperadorDetailSerializer
    permission_classes = [IsAuthenticated]

class OperadorRegisterView(CreateAPIView):
    serializer_class = OperadorRegisterSerializer

class OperadorLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Logout efetuado com sucesso."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:
            return Response(
                {"detail": "Refresh token inválido."},
                status=status.HTTP_400_BAD_REQUEST,
            )
