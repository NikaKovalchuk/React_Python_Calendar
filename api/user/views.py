from django.shortcuts import render, redirect
from .forms import UserCreationForm, UserLogInForm
from django.contrib.auth import authenticate, login, logout

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