from django.urls import path
from .views import (
    IncidentListView,
    IncidentCreateView,
    IncidentDetailView,
    IncidentUpdateView,
    IncidentJoinView,
    IncidentLeaveView,
)

urlpatterns = [
    path("", IncidentListView.as_view(), name="incident-list"),
    path("create/", IncidentCreateView.as_view(), name="incident-create"),
    path("<int:pk>/", IncidentDetailView.as_view(), name="incident-detail"),
    path("<int:pk>/update/", IncidentUpdateView.as_view(), name="incident-update"),
    path("<int:pk>/join/", IncidentJoinView.as_view(), name="incident-join"),
    path("<int:pk>/leave/", IncidentLeaveView.as_view(), name="incident-leave"),
]
