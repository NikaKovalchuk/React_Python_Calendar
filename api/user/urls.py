from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('signup/', views.RegistrationAPI.as_view()),
    path('login/', views.LoginAPI.as_view()),
    path('current/', views.CurrentUser.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
