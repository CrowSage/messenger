from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from rest_framework_simplejwt.exceptions import ExpiredTokenError, InvalidToken

User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            encoded_string = scope["query_string"]
            query_string = encoded_string.decode()
            token_str = query_string.split("token=")[-1]
            access = AccessToken(token_str)
            user_id = access["user_id"]

            user = await database_sync_to_async(User.objects.get)(id=user_id)
            scope["user"] = user
        except (User.DoesNotExist, ExpiredTokenError, InvalidToken, Exception) as e:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
