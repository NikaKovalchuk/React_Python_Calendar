from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'/(?P<pk>\d+)', views.event, name='event'),
    url('', views.eventList, name='eventList'),
]