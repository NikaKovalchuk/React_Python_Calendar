from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'(?P<pk>\d+)/edit', views.editEvent, name='editEvent'),
    url(r'(?P<pk>\d+)', views.event, name='event'),
    url(r'new', views.createEvent, name='createEvent'),
    url('', views.eventList, name='eventList'),
]