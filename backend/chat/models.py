from django.db import models
from django.conf import settings


# Create your models here.
class Conversation(models.Model):

    TYPE_CHOICES = [
        ("direct", "Direct"),
        ("group", "Group"),
    ]

    name = models.CharField(max_length=20, blank=True)
    conversation_type = models.CharField(choices=TYPE_CHOICES, default="direct")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ConversationParticipant(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True)


class Message(models.Model):

    TYPE_CHOICES = [
        ("text", "Text"),
        ("image", "Image"),
        ("file", "File"),
    ]

    content = models.CharField(max_length=5000)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.DO_NOTHING,
        related_name="sent_messages",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    read_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="read_messages"
    )
    message_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="text")


class Attachment(models.Model):

    TYPE_CHOICES = [
        ("image", "Image"),
        ("video", "Video"),
        ("document", "Document"),
    ]

    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    file_url = models.URLField()
    file_type = models.CharField(choices=TYPE_CHOICES, default="document")
    file_size = models.IntegerField()
