from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):

    is_online = models.BooleanField(default=False)
    # pfp = something
