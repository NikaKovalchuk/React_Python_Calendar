from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from django.urls import path

urlpatterns = [
    path('<int:pk>/', views.UserDetail.as_view(), name="user-detail"),
    path('', views.UserList.as_view(), name="user-list"),
]

urlpatterns = format_suffix_patterns(urlpatterns)