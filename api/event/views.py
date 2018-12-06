from django.utils import timezone
from rest_framework import viewsets
from django.shortcuts import render, get_object_or_404, redirect
from .models import  Event
from api.user.models import User
from .forms import EventChangeForm, EventCreationForm
from.serializers import EventSchema

class EventView():
    def __init__(self, user):
        super(EventView, self).__init__(user)
        self.schema = EventSchema(many=True)
        self.model = Event

    def get(self, user):
        events = Event.objects.filter(
            create_date__lte=timezone.now(),
            delete=False
        ).order_by('start_date')
        serializer_class = UserSerializer
        return self.get_object_or_404(model=self.model, criteria=self.criteria, message=self.message_404)


# def eventList(request):
#     user = get_object_or_404(User, pk=request.user.pk)
#     events = Event.objects.filter(
#         create_date__lte=timezone.now(),
#         delete=False,
#         user__in=[user]
#     ).order_by('start_date')
#     return render(request, 'event/event_list.html', {'events': events})

def event(request, pk):
    event = get_object_or_404(Event, pk=pk)
    return render(request, 'event/event.html', {'event':event})

def edit(request, pk):
    event = get_object_or_404(Event, pk=pk)
    if request.method == "POST":
        form = EventChangeForm(request.POST, instance=event)
        if form.is_valid():
            post = form.save(commit=False)
            post.update_date = timezone.now()
            post.save()
            return redirect('event', pk=post.pk)
    else:
        form = EventChangeForm(instance=event)
    return render(request, 'event/edit_event.html', {'form': form})

def create(request):
    if request.method == "POST":
        form = EventCreationForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            user = get_object_or_404(User, pk=request.user.pk)
            post.save()
            post.user_set.add(user)
            post.created_date = timezone.now()
            post.save()
            return redirect('event', pk=post.pk)
    else:
        form = EventCreationForm()
    return render(request, 'event/edit_event.html', {'form':form})

def remove(request, pk):
    event = get_object_or_404(Event, pk=pk)
    event.delete = True
    event.delete_date = timezone.now()
    event.save()
    return eventList(request)


