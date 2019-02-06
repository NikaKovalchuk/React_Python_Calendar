from django.http import Http404
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from api.event.models import Event
from .models import Calendar
from .serializers import CalendarSerializer, NewCalendarSerializer


class ListAPI(APIView):
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
            return ListAPI.get(ListAPI, request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ElementAPI(APIView):
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
            return ListAPI.get(ListAPI, request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        calendar = self.get_object(pk, request.user.id)
        calendar.delete()
        return ListAPI.get(ListAPI,request)


class ImportAPI(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def get(self, request):
        if 'id' in request.query_params:
            calendars = request.query_params['id'].split(',')
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        calendars = Calendar.objects.filter(id__in=calendars)
        for calendar in calendars:
            calendar.copy(request.user)
        return ListAPI.get(ListAPI,request)
