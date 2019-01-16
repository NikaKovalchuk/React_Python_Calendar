from datetime import datetime

from django.http import Http404, HttpResponse
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from tablib import Dataset

from app.settings import ADMIN_USER_ID
from .constant import CycleType
from .models import Event
from .resources import EventResource
from .serializers import EventSerializer, NewEventSerializer


class EventList(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        startDate = datetime.today()
        finishDate = datetime.today()  # какие именно данные тут
        if not request:
            if not request.user:
                if not request.user.id:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
        if 'startDate' in request.query_params:
            startDate = request.query_params['startDate']
        if 'finishDate' in request.query_params:
            finishDate = request.query_params['finishDate']
        events = Event.objects.filter(
            start_date__gte=startDate,
            finish_date__lte=finishDate,
            user=request.user.id,
            archived=False
        )
        # extra = self.repeatedEvents(startDate, finishDate, events, user=request.user)
        serializer_context = {
            'request': request,
        }
        serializer = EventSerializer(events, many=True, context=serializer_context)
        return Response(serializer.data)

    def post(self, request):
        serializer_context = {
            'request': request,
        }
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
            cycle_not=CycleType.NO
        )
        # для каждого евента
        #     Для каждого дня от startDate до finishDate:
        #         ДЕНЬ: поменять дату и добавить копию
        #         НЕДЕЛЯ: разница дней должна быть кртна 7
        #         МЕСЯЦ: одинаковые числа
        #         ГОД : одинаковые чило и год
        # Всегда добавляем копию, чтоб можно было по id вносить изменения.
        pass


class EventDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get_object(self, pk, request):
        try:
            if request.user.id == ADMIN_USER_ID:
                return Event.objects.filter(
                    archived=False,
                    pk=pk).first()
            else:
                return Event.objects.filter(
                    user=request.user.id,
                    archived=False,
                    pk=pk,
                ).first()
            return Event.objects.filter(
                pk=pk
            ).first()
        except Event.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk, request)
        if event:
            serializer = EventSerializer(event, context=serializer_context)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        serializer_context = {
            'request': request,
        }
        event = self.get_object(pk, request)
        if not request.data:
            return Response(status=status.HTTP_411_LENGTH_REQUIRED)
        serializer = EventSerializer(event, data=request.data, context=serializer_context)
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
