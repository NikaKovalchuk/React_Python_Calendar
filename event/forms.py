from django import forms
from .models import Event

class EventCreationForm():

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'price', 'status')

class EventChangeForm():

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'price', 'status')