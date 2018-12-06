from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm
from api.user.models import User

class UserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = UserCreationForm.Meta.fields

class UserChangeForm(UserChangeForm):

    class Meta(UserChangeForm):
        model = User
        fields = UserChangeForm.Meta.fields

class UserLogInForm(AuthenticationForm):

    class Meta(AuthenticationForm):
        model = User