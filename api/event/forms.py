from django import forms
from .models import Event

class EventCreationForm(forms.ModelForm):

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'price', 'status')

class EventChangeForm(forms.ModelForm):

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'price', 'status')