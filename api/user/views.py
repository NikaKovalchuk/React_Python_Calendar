from api.user.models import User
from.serializers import UserSerializer
from rest_framework import generics

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

#
# def signUpUser(request):
#     if request.method == "POST":
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password1']
#             user = authenticate(username=username, password=password)
#             if user is not None:
#                #return redirect('eventList')
#                 pass
#     else:
#         form = UserCreationForm()
#     return render(request, 'user/signup.html', {'form':form})
#
# def logInUser(request):
#     if request.method == "POST":
#         form = UserLogInForm(request.POST)
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(username=username, password=password)
#         if user is not None:
#                 login(request, user)
#                 #return redirect('eventList')
#         else:
#             return render(request, 'user/login.html', {'form':form, 'error_message': 'Your username or password incorrect'})
#     else:
#         form = UserLogInForm()
#     return render(request, 'user/login.html', {'form':form})
#
# def logOutUser(request):
# 	logout(request)
# 	return logInUser(request)
#
# def account(request):
#     changed_password_form = UserPasswordChangeForm(request.user)
#     edit_user_form = UserChangeForm(request.user)
#     if request.method == 'POST':
#         if 'edit_user' in request.POST:
#             edit_user_form = UserChangeForm(request.user, request.POST)
#             if edit_user_form.is_valid():
#                 edit_user_form.save()
#                 messages.success(request, 'Your info was successfully updated!')
#                 return redirect('account')
#             else:
#                 messages.error(request, 'Please correct the error below.')
#         elif 'changed_password' in request.POST:
#             changed_password_form = UserPasswordChangeForm(request.user, request.POST)
#             if changed_password_form.is_valid():
#                 user = changed_password_form.save()
#                 update_session_auth_hash(request, user)  # Important!
#                 messages.success(request, 'Your password was successfully updated!')
#                 return redirect('account')
#             else:
#                 messages.error(request, 'Please correct the error below.')
#         else:
#             return redirect('account')
#     return render(request, 'user/account.html', {'changed_password_form':changed_password_form, 'edit_user_form':edit_user_form})