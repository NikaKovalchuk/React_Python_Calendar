from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from .models import  Event
from api.user.models import User
from .forms import EventChangeForm, EventCreationForm

def eventList(request):
    events = Event.objects.filter(create_date__lte=timezone.now(), delete=False).order_by('start_date')
    return render(request, 'event/event_list.html', {'events': events})

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