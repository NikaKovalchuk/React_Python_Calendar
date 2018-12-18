from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import permission_classes

from app.settings import ADMIN_USER_ID
from .models import User
from .serializers import UserSerializer
from api.event.permissions import IsOwnerOrReadOnly
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# @permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
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

# @permission_classes((IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly ))
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