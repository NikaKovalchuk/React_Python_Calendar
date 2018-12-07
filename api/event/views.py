from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import permission_classes
from .models import Event
from.serializers import EventSerializer
from api.event.permissions import IsOwnerOrReadOnly
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

@permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventList(APIView):

    def get(self, request, format=None):
        events = Event.objects.all()
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(events, many=True, context=serializer_context)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
class EventDetail(APIView):
    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk)
        serializer = EventSerializer(event, context=serializer_context)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk)
        serializer = EventSerializer(event, data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        event = self.get_object(pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)