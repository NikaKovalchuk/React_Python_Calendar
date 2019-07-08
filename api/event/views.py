import copy
import datetime
from datetime import datetime, timedelta, date

import dateutil.parser
from django.db.models import Q
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event, Calendar
from .serializers import EventSerializer, NewEventSerializer
from .enums import EventNotificationEnum, EventRepeatEnum


class ElementAPI(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, user):
        try:
            return Event.objects.get(user=user, archived=False, pk=pk)
        except Event.DoesNotExist:
            raise Http404()

    def put(self, request, pk):
        event = self.get_object(pk, request.user.id)
        calendar = Calendar.objects.get(id=request.data['calendar']['id'])

        serializer_context = {'request': request}
        serializer = EventSerializer(event, data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.validated_data['calendar'] = calendar
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        event = self.get_object(pk, request.user.id)
        event.delete()
        return Response(status=status.HTTP_200_OK)


class ListAPI(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        notification = False
        calendars_id = []
        start_date = dateutil.parser.parse(request.query_params['startDate'])
        finish_date = dateutil.parser.parse(request.query_params['finishDate'])
        if 'calendar' in request.query_params:
            calendars_id = request.query_params['calendar']
            calendars_id = calendars_id.split(',')
        if 'notification' in request.query_params:
            notification = True

        events = Event.objects.filter(user=request.user.id, archived=False,
                                      repeat=EventRepeatEnum.NO, calendar_id__in=calendars_id)
        events = list(events.filter(Q(start_date__gte=start_date, finish_date__lte=finish_date) |
                                    Q(start_date__lte=start_date, finish_date__gte=start_date) |
                                    Q(start_date__lte=finish_date, finish_date__gte=finish_date)))

        events = self.repeated_events(start_date=start_date, finish_date=finish_date, events=events,
                                      user=request.user, calendars_id=calendars_id)
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
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def repeated_events(self, start_date, finish_date, events, user, calendars_id):
        extra = Event.objects.filter(
            user=user.id,
            archived=False,
            repeat__isnull=False,
            calendar_id__in=calendars_id
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
                if event.repeat == EventRepeatEnum.DAY:
                    events.append(new_event)
                if event.repeat == EventRepeatEnum.WEEK:
                    if abs(event.start_date.date() - checked_start_date.date()).days % 7 == 0:
                        events.append(new_event)
                if event.repeat == EventRepeatEnum.MONTH:
                    if event.start_date.day == checked_start_date.day:
                        events.append(new_event)
                if event.repeat == EventRepeatEnum.YEAR:
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
                    if event.notification == EventNotificationEnum.DAY:
                        if diff.seconds < 60 * 60 * 24:
                            result.append(event)
                    if event.notification == EventNotificationEnum.HOUR:
                        if diff.seconds < 60 * 60:
                            result.append(event)
                    if event.notification == EventNotificationEnum.HALF_HOUR:
                        if diff.seconds < 60 * 30:
                            result.append(event)
                    if event.notification == EventNotificationEnum.TEN_MINUTES:
                        if diff.seconds < 60 * 10:
                            result.append(event)
        return result
