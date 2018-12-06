from django.shortcuts import render, redirect, get_object_or_404
from .forms import UserCreationForm, UserLogInForm, UserChangeForm, UserPasswordChangeForm
from api.user.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash

def signUpUser(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            if user is not None:
               return redirect('eventList')
    else:
        form = UserCreationForm()
    return render(request, 'user/signup.html', {'form':form})

def logInUser(request):
    if request.method == "POST":
        form = UserLogInForm(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
                login(request, user)
                return redirect('eventList')
        else:
            return render(request, 'user/login.html', {'form':form, 'error_message': 'Your username or password incorrect'})
    else:
        form = UserLogInForm()
    return render(request, 'user/login.html', {'form':form})

def logOutUser(request):
	logout(request)
	return logInUser(request)

def account(request):
    if request.method == 'POST':
        form = UserPasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('account')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = UserPasswordChangeForm(request.user)
    return render(request, 'user/account.html', {'form':form})