from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'(?P<pk>\d+)/edit', views.edit, name='editEvent'),
    url(r'(?P<pk>\d+)/remove', views.remove, name='removeEvent'),
    url(r'(?P<pk>\d+)', views.event, name='event'),
    url(r'new', views.create, name='createEvent'),
    url('', views.eventList, name='eventList'),
]