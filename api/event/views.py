import copy
import datetime
from datetime import datetime, timedelta, date

import dateutil.parser
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event, Calendar
from .serializers import EventSerializer, NewEventSerializer, CalendarSerializer, NewCalendarSerializer


class EventList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]
    repeat = {'no': 0, 'day': 1, 'week': 2, 'month': 3, 'year': 4}
    notifications = {'no': 0, 'day': 1, 'hour': 2, 'half-hour': 3, 'ten-minutes': 4}

    def get(self, request):
        notification = False
        start_date = dateutil.parser.parse(request.query_params['startDate'])
        finish_date = dateutil.parser.parse(request.query_params['finishDate'])
        calendar = request.query_params['calendar'].split(',')
        if 'notification' in request.query_params:
            notification = True

        events = Event.objects.filter(start_date__gte=start_date, finish_date__lte=finish_date, user=request.user.id,
                                      archived=False, repeat=self.repeat['no'], calendar_id__in=calendar) | \
                 Event.objects.filter(
                     start_date__lte=start_date, finish_date__lte=finish_date, user=request.user.id,
                     archived=False, repeat=self.repeat['no'], calendar_id__in=calendar) | \
                 Event.objects.filter(
                     start_date__gte=start_date, finish_date__gte=finish_date, user=request.user.id,
                     archived=False, repeat=self.repeat['no'], calendar_id__in=calendar)

        events = list(events)
        events = self.repeatedEvents(start_date=start_date, finish_date=finish_date, events=events, user=request.user,
                                     calendar=calendar)
        if notification:
            events = self.notification(events=events)
        events = sorted(events, key=lambda x: x.start_date)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer_context = {'request': request, 'data': request.data}
        serializer = NewEventSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return self.get(self, request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def repeatedEvents(self, start_date, finish_date, events, user, calendar):
        extra = Event.objects.filter(
            user=user.id,
            archived=False,
            repeat__isnull=False,
            calendar_id__in=calendar
        )

        for event in extra:
            checked_start_date = start_date - timedelta(days=(event.finish_date - event.start_date).days)
            while checked_start_date < finish_date:
                new_event = copy.copy(event)
                new_event.start_date = checked_start_date.replace(hour=new_event.start_date.hour,
                                                                  minute=new_event.start_date.minute)
                finish_checked_date = checked_start_date + timedelta(
                    days=abs(event.start_date.date() - event.finish_date.date()).days)
                new_event.finish_date = finish_checked_date.replace(hour=new_event.finish_date.hour,
                                                                    minute=new_event.finish_date.minute)
                if event.repeat == self.repeat['day']:
                    events.append(new_event)
                if event.repeat == self.repeat['week']:
                    if abs(event.start_date.date() - checked_start_date.date()).days % 7 == 0:
                        events.append(new_event)
                if event.repeat == self.repeat['month']:
                    if event.start_date.day == checked_start_date.day:
                        events.append(new_event)
                if event.repeat == self.repeat['year']:
                    if event.start_date.day == checked_start_date.day and event.start_date.month == checked_start_date.month:
                        events.append(new_event)
                checked_start_date = checked_start_date + timedelta(days=1)
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

    def get_object(self, pk, user):
        try:
            return Event.objects.get(user=user, archived=False, pk=pk)
        except Event.DoesNotExist:
            raise Http404()

    def get(self, request, pk):
        event = self.get_object(pk, request.user.id)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def put(self, request, pk):
        event = self.get_object(pk, request.user.id)
        calendar = Calendar.objects.get(id=request.data['calendar']['id'])

        serializer_context = {'request': request}
        serializer = EventSerializer(event, data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.validated_data['calendar'] = calendar
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self.get_object(pk, request.user.id)
        event.delete()
        return Response(status=status.HTTP_200_OK)


class CalendarList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        calendars = Calendar.objects.filter(user=request.user, archived=False)
        if 'import' in request.query_params:
            calendars = Calendar.objects.filter(archived=False, public=True).exclude(user=request.user)
        serializer = CalendarSerializer(calendars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer_context = {'request': request, }
        serializer = NewCalendarSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return CalendarList.get(CalendarList, request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CalendarDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, user):
        try:
            return Calendar.objects.get(user=user, archived=False, pk=pk)
        except Event.DoesNotExist:
            raise Http404()

    def put(self, request, pk):
        calendar = self.get_object(pk, request.user.id)
        serializer = CalendarSerializer(calendar, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return CalendarList.get(CalendarList, request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        calendar = self.get_object(pk, request.user.id)
        calendar.delete()
        return CalendarList.get(CalendarList, request)


class ImportCalendar(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        if 'id' in request.query_params:
            calendars = request.query_params['id'].split(',')
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        calendars = Calendar.objects.filter(id__in=calendars)
        for calendar in calendars:
            calendar.copy(request.user)
        return CalendarList.get(CalendarList, request)
