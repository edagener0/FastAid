from django.urls import path
from .views import OperadorDetailView, OperadorListView, OperadorRegisterView, OperadorLogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("operadores/<int:pk>/", OperadorDetailView.as_view(), name="operador-detail"),
    path("operadores/", OperadorListView.as_view(), name="operador-list"),
    path("register/", OperadorRegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("logout/", OperadorLogoutView.as_view()),
]
