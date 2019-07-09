import dateutil.parser
from django.db.models import Q
from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from api.event.utils import repeated_events, get_notification
from .models import Event, Calendar
from .serializers import EventSerializer, NewEventSerializer
from .enums import EventRepeatEnum


class ElementAPI(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, user):
        try:
            return Event.objects.get(user=user, is_archived=False, pk=pk)
        except Event.DoesNotExist:
            raise Http404()

    def put(self, request, pk):
        user_id = request.user.id
        calendar_id = request.data['calendar']['id']

        event = self.get_object(pk, user_id)
        calendar = Calendar.objects.get(id=calendar_id)

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
        notification_type = False
        calendars_id = []
        start_date = dateutil.parser.parse(request.query_params['startDate'])
        finish_date = dateutil.parser.parse(request.query_params['finishDate'])
        if 'calendar' in request.query_params:
            calendars_id = request.query_params['calendar'].split(',')
        if 'notification_type' in request.query_params:
            notification_type = True

        events = Event.objects.filter(
            user=request.user.id,
            is_archived=False,
            repeat_type=EventRepeatEnum.NO,
            calendar_id__in=calendars_id
        )
        events = list(events.filter(
            Q(start_date__gte=start_date, finish_date__lte=finish_date) |
            Q(start_date__lte=start_date, finish_date__gte=start_date) |
            Q(start_date__lte=finish_date, finish_date__gte=finish_date)))

        events = repeated_events(
            start_date=start_date,
            finish_date=finish_date,
            events=events,
            user=request.user,
            calendars_id=calendars_id
        )

        if notification_type:
            events = get_notification(events=events)
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