from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AuthenticationForm, PasswordChangeForm
from api.user.models import User
from django import forms

class UserCreationForm(UserCreationForm):

    class Meta(UserCreationForm):
        model = User
        fields = UserCreationForm.Meta.fields

class UserChangeForm(forms.Form):

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password']

    username = forms.CharField(label='username', max_length=100)
    first_name = forms.CharField(label='first_name', max_length=100)
    last_name = forms.CharField(label='last_name', max_length=100)
    email = forms.EmailField(label='email', max_length=100)
    password = forms.PasswordInput()

class UserPasswordChangeForm(PasswordChangeForm):

    class Meta(PasswordChangeForm):
        model = User

class UserLogInForm(AuthenticationForm):

    class Meta(AuthenticationForm):
        model = User