from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import permission_classes
from .models import Event
from.serializers import EventSerializer
from rest_framework import generics
from api.event.permissions import IsOwnerOrReadOnly

@permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

#
# class EventView():
#     def __init__(self, user):
#         super(EventView, self).__init__(user)
#         self.schema = EventSchema(many=True)
#         self.model = Event
#
#     def get(self, user):
#         events = Event.objects.filter(
#             create_date__lte=timezone.now(),
#             delete=False
#         ).order_by('start_date')
#         serializer_class = UserSerializer
#         return self.get_object_or_404(model=self.model, criteria=self.criteria, message=self.message_404)
#
#
# # def eventList(request):
# #     user = get_object_or_404(User, pk=request.user.pk)
# #     events = Event.objects.filter(
# #         create_date__lte=timezone.now(),
# #         delete=False,
# #         user__in=[user]
# #     ).order_by('start_date')
# #     return render(request, 'event/event_list.html', {'events': events})
#
# def event(request, pk):
#     event = get_object_or_404(Event, pk=pk)
#     return render(request, 'event/event.html', {'event':event})
#
# def edit(request, pk):
#     event = get_object_or_404(Event, pk=pk)
#     if request.method == "POST":
#         form = EventChangeForm(request.POST, instance=event)
#         if form.is_valid():
#             post = form.save(commit=False)
#             post.update_date = timezone.now()
#             post.save()
#             return redirect('event', pk=post.pk)
#     else:
#         form = EventChangeForm(instance=event)
#     return render(request, 'event/edit_event.html', {'form': form})
#
# def create(request):
#     if request.method == "POST":
#         form = EventCreationForm(request.POST)
#         if form.is_valid():
#             post = form.save(commit=False)
#             user = get_object_or_404(User, pk=request.user.pk)
#             post.save()
#             post.user_set.add(user)
#             post.created_date = timezone.now()
#             post.save()
#             return redirect('event', pk=post.pk)
#     else:
#         form = EventCreationForm()
#     return render(request, 'event/edit_event.html', {'form':form})
#
# def remove(request, pk):
#     event = get_object_or_404(Event, pk=pk)
#     event.delete = True
#     event.delete_date = timezone.now()
#     event.save()
#     return eventList(request)
#
#
