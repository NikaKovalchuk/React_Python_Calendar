import calendar
from datetime import timedelta

from django.http import Http404, HttpResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .constant import ViewType
from tablib import Dataset

from app.settings import ADMIN_USER_ID
from .models import Event
from .resources import EventResource
from .serializers import EventSerializer, NewEventSerializer


class EventList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request, format=None):
        date = request.data.date
        type = ViewType[request.data.type]
        startDate = self.getStartDate(date, type)
        finishDate = self.getFinishDate(date, type)
        events = Event.objects.filter(
            start_date__gte = startDate,
            finish_date__lte = finishDate,
            user=request.user.id,
            archived=False
        )
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(events, many=True, context=serializer_context)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer_context = {
            'request': request,
        }
        serializer = NewEventSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def getStartDate(self, date, type):
        if type == ViewType.DAY:
            startDate = date
        if type == ViewType.WEEK:
            numbeOfDay = date.weekday()
            startDate = date - timedelta(days=numbeOfDay)
        if type == ViewType.MONTH:
            numbeOfDay = date.day()
            startDate = date - timedelta(days=numbeOfDay-1)
        return startDate

    def getFinishDate(self, date, type):
        if type == ViewType.DAY:
            finishDate = date
        if type == ViewType.WEEK:
            numbeOfDay = 6 - date.weekday()
            finishDate = date + timedelta(days=numbeOfDay)
        if type == ViewType.MONTH:
            numbeOfDay = date.day()
            lastDay = calendar.monthrange(date.year(), date.month())[1]
            finishDate = date + timedelta(days=lastDay-numbeOfDay)
        return finishDate

class EventDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, request):
        try:
            if request.user.id == ADMIN_USER_ID:
                return Event.objects.filter(
                    archived=False,
                    pk=pk
                ).first()
            else:
                return Event.objects.filter(
                    user = request.user.id,
                    archived=False,
                    pk=pk,
                ).first()
            return Event.objects.filter(
                pk=pk
            ).first()
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk, request)
        if event:
            serializer = EventSerializer(event, context=serializer_context)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

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


class EventsExport(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    # export
    def get(self, request):
        event_resource = EventResource()
        dataset = event_resource.export()
        response = HttpResponse(dataset.json, content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="calendar.json"'
        return response

    # import
    def post(self, request):
        event_resource = EventResource()
        dataset = Dataset()
        new_events = request.FILES['file']

        imported_data = dataset.load(new_events.read())
        result = event_resource.import_data(dataset, dry_run=True)

        if not result.has_errors():
            event_resource.import_data(dataset, dry_run=False)  # Actually import now
