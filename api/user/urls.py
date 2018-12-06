from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signUpUser, name='signup'),
    path('login', views.logInUser, name='login'),
    path('logout', views.logOutUser, name='logout'),
    path('account', views.account, name='account'),
]