from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from .models import  Event
from user.models import CustomUser
from .forms import EventChangeForm, EventCreationForm

def eventList(request):
    events = Event.objects.filter(create_date__lte=timezone.now()).order_by('start_date')
    return render(request, 'event/event_list.html', {'events': events})

def event(request, pk):
    event = get_object_or_404(Event, pk=pk)
    return render(request, 'event/event.html', {'event':event})

def editEvent(request, pk):
    event = get_object_or_404(Event, pk=pk)
    if request.method == "POST":
        form = EventChangeForm(request.POST, instance=event)
        if form.is_valid():
            post = form.save(commit=False)
            user = get_object_or_404(CustomUser, pk = request.user.pk)
            post.user_set.add(user)
            post.update_date = timezone.now()
            post.save()
            return redirect('event', pk=post.pk)
    else:
        form = EventChangeForm(instance=event)
    return render(request, 'event/edit_event.html', {'form': form})

def createEvent(request):
    if request.method == "POST":
        form = EventCreationForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            user = get_object_or_404(CustomUser, pk=request.user.pk)
            post.save()
            post.user_set.add(user)
            post.created_date = timezone.now()
            post.save()
            return redirect('event', pk=post.pk)
    else:
        form = EventCreationForm()
    return render(request, 'event/edit_event.html', {'form':form})
