from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


class UserList(APIView):

    def get(self, request, format=None):
        serializer_context = {
            'request': request,
        }
        events = User.objects.all()
        serializer = UserSerializer(events, many=True, context=serializer_context)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer_context = {
            'request': request,
        }
        serializer = UserSerializer(data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):

    def get_object(self, pk, request):
        try:
            return User.objects.filter(
                pk=pk
            ).first()
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        user = self.get_object(pk, request)
        serializer = UserSerializer(user, context=serializer_context)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        serializer_context = {
            'request': request,
        }
        user = self.get_object(pk, request)
        serializer = UserSerializer(user, data=request.data, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk, request)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUser(APIView):
    def get_object(self, request):
        try:
            return User.objects.filter(
                pk=request.user.id
            ).first()
        except User.DoesNotExist:
            raise Http404

    def get(self, request):
        serializer_context = {
            'request': request,
        }
        user = self.get_object(request)
        serializer = UserSerializer(user, context=serializer_context)
        return Response(serializer.data)
