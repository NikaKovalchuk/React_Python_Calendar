from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from api.user.models import User
from .forms import UserCreationForm


class UserAdmin(UserAdmin):
    model = User
    add_form = UserCreationForm


admin.site.register(User, UserAdmin)
