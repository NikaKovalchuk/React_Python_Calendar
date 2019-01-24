import copy
import datetime
from datetime import datetime, timedelta, date

import dateutil.parser
from django.http import Http404, HttpResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from tablib import Dataset

from app.settings import ADMIN_USER_ID
from .models import Event
from .resources import EventResource
from .serializers import EventSerializer, NewEventSerializer


class EventList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]
    repeat = {'no': 0, 'day': 1, 'week': 2, 'month': 3, 'year': 4}
    notifications = {'no': 0, 'day': 1, 'hour': 2, 'half-hour': 3, 'ten-minutes': 4}

    def get(self, request):
        startDate = datetime.now()
        startDate = startDate.replace(hour=0, minute=0, second=0)

        finishDate = datetime.now()
        finishDate = finishDate.replace(hour=23, minute=59, second=59)

        if not request.user.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        if request.query_params is not None:
            if 'startDate' in request.query_params:
                startDate = dateutil.parser.parse(request.query_params['startDate'])
            if 'finishDate' in request.query_params:
                finishDate = dateutil.parser.parse(request.query_params['finishDate'])

        events = Event.objects.filter(start_date__gte=startDate, finish_date__lte=finishDate, user=request.user.id,
                                      archived=False, repeat=self.repeat['no']) | \
                 Event.objects.filter(
                     start_date__lte=startDate, finish_date__lte=finishDate, user=request.user.id,
                     archived=False, repeat=self.repeat['no']) | \
                 Event.objects.filter(
                     start_date__gte=startDate, finish_date__gte=finishDate, user=request.user.id,
                     archived=False, repeat=self.repeat['no'])

        events = list(events)
        events = self.repeatedEvents(startDate=startDate, finishDate=finishDate, events=events, user=request.user)
        notification = EventSerializer(self.notification(events), many=True)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    @staticmethod
    def post(request):
        serializer_context = {'request': request, }

        if not request.data:
            return Response(status=status.HTTP_411_LENGTH_REQUIRED)

        serializer = NewEventSerializer(data=request.data, context=serializer_context)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def repeatedEvents(self, startDate, finishDate, events, user):
        extra = Event.objects.filter(
            user=user.id,
            archived=False,
            repeat__isnull=False,
        )

        for event in extra:
            checkedDate = startDate
            while checkedDate < finishDate:
                if event.repeat == self.repeat['day']:
                    newEvent = copy.copy(event)
                    newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                              minute=newEvent.start_date.minute)
                    newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                               minute=newEvent.finish_date.minute)
                    events.append(newEvent)

                if event.repeat == self.repeat['week']:
                    if abs(event.start_date.date() - checkedDate.date()).days % 7 == 0:
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)

                if event.repeat == self.repeat['month']:
                    if event.start_date.day == checkedDate.day:
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)

                if event.repeat == self.repeat['year']:
                    if event.start_date.day == checkedDate.day and event.start_date.month == checkedDate.month:
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)
                checkedDate = checkedDate + timedelta(days=1)
        return events

    def notification(self, events):
        result = []
        today = datetime.utcnow()
        for event in events:
            if abs(event.start_date.date() - today.date()).days <= 1:
                diff = datetime.combine(date.min, event.start_date.time()) - datetime.combine(date.min, today.time())
                if event.notice:
                    if event.notification == self.notifications['day']:
                        if diff.seconds < 60 * 60 * 24:
                            result.append(event)
                    if event.notification == self.notifications['hour']:
                        if diff.seconds < 60 * 60:
                            result.append(event)
                    if event.notification == self.notifications['half-hour']:
                        if diff.seconds < 60 * 30:
                            result.append(event)
                    if event.notification == self.notifications['ten-minutes']:
                        if diff.seconds < 60 * 10:
                            result.append(event)
        return result


class EventDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, request):
        try:
            if request.user.id == ADMIN_USER_ID:
                return Event.objects.filter(archived=False, pk=pk).first()
            else:
                return Event.objects.filter(user=request.user.id, archived=False, pk=pk).first()
            return Event.objects.filter(pk=pk).first()
        except Event.DoesNotExist:
            raise Http404()

    def get(self, request, pk):
        event = self.get_object(pk, request)
        if event:
            serializer = EventSerializer(event)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        event = self.get_object(pk, request)
        if not request.data:
            return Response(status=status.HTTP_411_LENGTH_REQUIRED)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self.get_object(pk, request)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EventsExport(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        event_resource = EventResource()
        dataset = event_resource.export()
        response = HttpResponse(dataset.json, content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="calendar.json"'
        return response

    def post(self, request):
        event_resource = EventResource()
        dataset = Dataset()
        new_events = request.FILES['file']

        imported_data = dataset.load(new_events.read())
        result = event_resource.import_data(dataset, dry_run=True)

        if not result.has_errors():
            event_resource.import_data(dataset, dry_run=False)  # Actually import now
