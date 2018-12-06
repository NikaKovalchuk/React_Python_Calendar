from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UserCreationForm
from api.user.models import User

class UserAdmin(UserAdmin):
    model = User
    add_form = UserCreationForm

admin.site.register(User, UserAdmin)