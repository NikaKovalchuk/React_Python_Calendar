from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('signup/', views.RegistrationAPI.as_view(), name="sign-up-user"),
    path('login/', views.LoginAPI.as_view(), name="log-in-user"),
    path('current/', views.CurrentUser.as_view(), name="current-user"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
