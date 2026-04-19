from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/chat/<int:chat_id>/", view=consumers.ChatConsumer.as_asgi()),
]
