from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import permission_classes
from rest_framework.renderers import TemplateHTMLRenderer

from app.settings import ADMIN_USER_ID
from .models import Event
from.serializers import EventSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# @permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventList(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'event/list.html'

    def get(self, request, format=None):
        events = Event.objects.filter(
            user__in = [request.user.id]
        )
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(events, many=True, context=serializer_context)
        return Response({'serializer': serializer, 'events': events})

    def post(self, request, format=None):
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventDetail(APIView):
    def get_object(self, pk, request):
        try:
            if request.user.id == ADMIN_USER_ID:
                return Event.objects.filter(
                    pk=pk
                )
            else:
                return Event.objects.filter(
                    pk=pk,
                    user__in=[request.user.id]
                )
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk,request)
        serializer = EventSerializer(event, context=serializer_context)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk, request)
        serializer = EventSerializer(event, data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        event = self.get_object(pk, request)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)