from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from django.utils.timezone import now
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.group_name = f"chat_{self.chat_id}"

        # Check if user is participant
        is_participant = await self.check_participant()

        if not is_participant:
            await self.close()
            return

        await self.accept()

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "user_status",
                "user_id": self.user.id,
                "is_online": True,
            },
        )

        await self.set_online()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("content")
        message_type = data.get("type")

        if message_type == "typing":
            await self.channel_layer.group_send(
                self.group_name, {"type": "typing_indicator", "user_id": self.user.id}
            )

        # Saving Message in DB
        elif message_text:
            message_obj = await self.save_message(message_text)

            # Broadcasting Message to everyone in group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_message",
                    "id": message_obj.id,
                    "content": message_text,
                    "sender": self.user.id,
                    "created_at": str(message_obj.created_at),
                    "read_by": [],
                },
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "id": event.get("id"),
                    "content": event["content"],
                    "sender": event["sender"],
                    "created_at": event["created_at"],
                    "read_by": event.get("read_by", []),
                }
            )
        )

    async def disconnect(self, close_code):
        await self.set_offline()

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "user_status",
                "user_id": self.user.id,
                "is_online": False,
            },
        )

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    @database_sync_to_async
    def save_message(self, message_text):
        chat = Conversation.objects.get(id=self.chat_id)
        message_obj = Message.objects.create(
            sender=self.user,
            content=message_text,
            conversation=chat,
        )

        chat.updated_at = now()
        chat.save(update_fields=["updated_at"])

        return message_obj

    @database_sync_to_async
    def check_participant(self):
        try:
            chat = Conversation.objects.get(id=self.chat_id)
            return chat.participants.filter(user=self.user).exists()
        except Conversation.DoesNotExist:
            return False

    async def read_receipt(self, event):
        await self.send(
            text_data=json.dumps({"type": "read_receipt", "user_id": event["user_id"]})
        )

    @database_sync_to_async
    def set_online(self):
        self.user.is_online = True
        self.user.save(update_fields=["is_online"])

    @database_sync_to_async
    def set_offline(self):
        self.user.is_online = False
        self.user.save(update_fields=["is_online"])

    async def user_status(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "user_status",
                    "user_id": event["user_id"],
                    "is_online": event["is_online"],
                }
            )
        )

    async def typing_indicator(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing",
                    "user_id": event["user_id"],
                }
            )
        )
