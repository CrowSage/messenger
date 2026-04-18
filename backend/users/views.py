from django.shortcuts import render
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


# For Creating an account
# Routed: /users/register/
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User Created Successfully"}, status=201)
    else:
        return Response(serializer.errors)


# For Searching Users
# Routed: /users/search/
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get("q", "").strip()

    if query:
        users = User.objects.filter(username__icontains=query)
    else:
        users = User.objects.none()

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
