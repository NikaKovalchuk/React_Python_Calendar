from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('<int:pk>/', views.EventDetail.as_view()),
    path('', views.EventList.as_view()),

    path('calendar/', views.CalendarList.as_view()),
    path('calendar/<int:pk>/', views.CalendarDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
