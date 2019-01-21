import copy
from datetime import datetime, timedelta

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
    cycleNo = 0
    cycleDay = 1
    cycleWeek = 2
    cycleMonth = 3
    cycleYear = 4

    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        startDate = datetime.now()
        startDate = startDate.replace(hour=0, minute=0, second=0)
        finishDate = datetime.now()
        finishDate = finishDate.replace(hour=23, minute=59, second=59)
        if not request.user.id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if request.query_params != None:
            if 'startDate' in request.query_params:
                startDate = dateutil.parser.parse(request.query_params['startDate'])
            if 'finishDate' in request.query_params:
                finishDate = dateutil.parser.parse(request.query_params['finishDate'])
        events = Event.objects.filter(start_date__gte=startDate, finish_date__lte=finishDate, user=request.user.id,
                                      archived=False, cycle=self.cycleNo) | \
                 Event.objects.filter(
                     start_date__lte=startDate, finish_date__lte=finishDate, user=request.user.id,
                     archived=False, cycle=self.cycleNo) | \
                 Event.objects.filter(
                    start_date__gte=startDate, finish_date__gte=finishDate, user=request.user.id,
                    archived=False, cycle=self.cycleNo)

        events = list(events)
        events = self.repeatedEvents(startDate, finishDate, events, user=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request):
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
            cycle__isnull=False,
        )

        for event in extra:
            checkedDate = startDate
            while checkedDate < finishDate:
                if event.cycle == self.cycleDay:
                    newEvent = copy.copy(event)
                    newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                              minute=newEvent.start_date.minute)
                    newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                               minute=newEvent.finish_date.minute)
                    events.append(newEvent)
                if event.cycle == self.cycleWeek:  # заменить на enum
                    if abs(event.start_date - checkedDate).days % 7 == 0:  # работает с датами, поменяй
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)
                if event.cycle == self.cycleMonth:  # заменить на enum
                    if event.start_date.day == checkedDate.day:
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)
                if event.cycle == self.cycleYear:  # заменить на enum
                    if event.start_date.day == checkedDate.day and event.start_date.month == checkedDate.month:
                        newEvent = copy.copy(event)
                        newEvent.start_date = checkedDate.replace(hour=newEvent.start_date.hour,
                                                                  minute=newEvent.start_date.minute)
                        newEvent.finish_date = checkedDate.replace(hour=newEvent.finish_date.hour,
                                                                   minute=newEvent.finish_date.minute)
                        events.append(newEvent)
                checkedDate = checkedDate + timedelta(days=1)
        return events


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
