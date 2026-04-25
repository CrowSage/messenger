from rest_framework import serializers
from .models import Conversation, ConversationParticipant, Message, Attachment


# CONVERSATION-PARTICIPANT SERIALIZER ============>


class ConversationParticipantSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")

    class Meta:
        model = ConversationParticipant
        fields = [
            "id",
            "user",
            "username",
            "conversation",
            "is_admin",
            "joined_at",
            "left_at",
        ]


# CONVERSATION SERIALIZER ============>


class ConversationSerializer(serializers.ModelSerializer):
    participants = ConversationParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "name",
            "conversation_type",
            "created_at",
            "updated_at",
            "participants",
        ]


# MESSAGE SERIALIZER ============>


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = [
            "id",
            "content",
            "sender",
            "conversation",
            "created_at",
            "read_by",
            "message_type",
        ]


# ATTACHMENT SERIALIZER ============>


class AttachmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attachment
        fields = [
            "id",
            "message",
            "file_url",
            "file_type",
            "file_size",
        ]
