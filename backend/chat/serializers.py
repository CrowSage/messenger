from rest_framework import serializers
from .models import Conversation, ConversationParticipant, Message, Attachment


# CONVERSATION SERIALIZER ============>


class ConversationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = [
            "name",
            "conversation_type",
            "created_at",
            "updated_at",
        ]


# CONVERSATION-PARTICIPANT SERIALIZER ============>


class ConversationParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConversationParticipant
        fields = [
            "user",
            "conversation",
            "is_admin",
            "joined_at",
            "left_at",
        ]


# MESSAGE SERIALIZER ============>


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = [
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
            "message",
            "file_url",
            "file_type",
            "file_size",
        ]
