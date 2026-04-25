from django.urls import path
from . import views

urlpatterns = [
    path("register/", view=views.register, name="register"),
    path("search/", view=views.search_users, name="search-user"),
    path("me/", view=views.me, name="me"),
]
