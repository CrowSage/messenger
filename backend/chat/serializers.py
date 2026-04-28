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
    last_message = serializers.SerializerMethodField("get_last_message")
    unread_count = serializers.SerializerMethodField("get_unread_count")

    class Meta:
        model = Conversation
        fields = [
            "id",
            "name",
            "conversation_type",
            "created_at",
            "updated_at",
            "participants",
            "last_message",
            "unread_count",
        ]

    def get_last_message(self, conversation):
        last_message = (
            Message.objects.filter(conversation=conversation)
            .order_by("-created_at")
            .first()
        )
        if last_message is None:
            return None

        return {"content": last_message.content, "created_at": last_message.created_at}

    def get_unread_count(self, conversation):
        user = self.context["request"].user
        unread_count = (
            Message.objects.filter(conversation=conversation)
            .exclude(read_by=user)
            .exclude(sender=user)
        ).count()

        return unread_count


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
