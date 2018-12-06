from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import UserCreationForm, UserChangeForm
from api.user.models import User

class UserAdmin(UserAdmin):
    model = User
    add_form = UserCreationForm
    form = UserChangeForm

admin.site.register(User, UserAdmin)