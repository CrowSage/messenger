from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Conversation, ConversationParticipant, Message, Attachment
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    ConversationSerializer,
    ConversationParticipantSerializer,
    MessageSerializer,
    AttachmentSerializer,
)

User = get_user_model()


# For Getting Chats
# Routed: /chat/
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chats(request):

    # Getting chats from DB
    users_chats = Conversation.objects.filter(participants__user=request.user)

    # Serializing
    serializer = ConversationSerializer(
        users_chats, many=True, context={"request": request}
    )

    # Sending Response
    return Response({"chats": serializer.data})


# For Getting Message of a chat
# Routed: /chat/<chat_id>
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, chat_id):

    # Checking if user is a participant of requested chat
    is_participant = ConversationParticipant.objects.filter(
        user=request.user, conversation_id=chat_id
    ).exists()

    if not is_participant:
        return Response({"message": "Not authorized"}, 403)

    # Getting and Returning Messages

    messages = Message.objects.filter(conversation_id=chat_id)
    serializer = MessageSerializer(messages, many=True)

    return Response(serializer.data)


# For Creating new chats
# Routed: /chat/new/
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_conversation(request):

    conversation_type = request.data.get("type")
    user = request.user

    if conversation_type == "direct":
        other_user = request.data.get("other_user")
        name = request.data.get("name", "")

        if not other_user:
            return Response({"error": "other_user not provided"})

        other_user = User.objects.get(id=other_user)

        chat_already_exist = Conversation.objects.filter(
            conversation_type="direct", participants__user=request.user
        ).filter(participants__user=other_user)

        if chat_already_exist:
            return Response({"id": chat_already_exist.first().id})

        chat = Conversation.objects.create(name=name, conversation_type="direct")
        ConversationParticipant.objects.create(conversation=chat, user=user)
        ConversationParticipant.objects.create(conversation=chat, user=other_user)

        return Response({"id": chat.id, "message": "Chat created sucessfully"})

    elif conversation_type == "group":
        name = request.data.get("name", "New-Group")
        members = request.data.get("users", [])

        if not isinstance(members, list):
            return Response(
                {"error": "users must be a list like: [user1_id, user2_id, user3_id]"}
            )

        members = set(members)
        members.add(request.user.id)

        if len(members) < 2:
            return Response({"error": "who are you planning to chat with?"})

        chat = Conversation.objects.create(name=name, conversation_type="group")
        for member in members:
            member = User.objects.filter(id=member)

            curr = ConversationParticipant.objects.create(
                user=member, conversation=chat
            )
            if member == user.id:
                curr.is_admin = True
                curr.save()

        return Response({"id": chat.id, "message": "Chat created sucessfully"})

    return Response(
        {"error": "provide with type:'direct' or 'group' when creating chat"}
    )
