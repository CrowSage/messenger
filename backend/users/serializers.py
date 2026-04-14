from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "is_online"]

    def validate_password(self, value):

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be atleast 8 characters long"
            )
        return value

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be atleast 3 characters long"
            )

        if not value.isalnum():
            raise serializers.ValidationError("Username must be alphanumeric.")

        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
