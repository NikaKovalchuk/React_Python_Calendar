from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('<int:pk>/', views.EventDetail.as_view(), name="event-detail"),
    path('export/', views.EventsExport.as_view(), name="events-export"),
    path('', views.EventList.as_view(), name="event-list"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
