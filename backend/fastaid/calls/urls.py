from django.urls import path
from .views import receive_call, recording, transcription

urlpatterns = [
    path("receive/", receive_call, name="receive_call"),
    path("recording/", recording, name="recording"),
    path("transcription/", transcription, name="transcription")
]
