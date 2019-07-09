from django.contrib.auth.models import AbstractUser, UserManager


class UserManager(UserManager):
    pass


class User(AbstractUser):

    def __str__(self):
        return self.username

    objects = UserManager()
