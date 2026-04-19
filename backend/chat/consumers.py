from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.group_name = f"chat_{self.chat_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("message")

        # Saving Message in DB
        if message_text:
            message_obj = await self.save_message(message_text)

            # Broadcasting Message to everyone in group
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_message",
                    "message": message_text,
                    "sender": self.user.id,
                    "created_at": str(message_obj.created_at),
                },
            )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
                    "created_at": event["created_at"],
                }
            )
        )

    async def disconnect(self):
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

        return message_obj
