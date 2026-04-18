from django.urls import path
from . import views

urlpatterns = [
    path("", view=views.get_chats),
    path("<int:chat_id>/", view=views.get_messages),
    path("new/", view=views.create_conversation),
]
