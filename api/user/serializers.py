from rest_framework import serializers

from api.event.models import Event
from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    event = serializers.HyperlinkedRelatedField(many=True, queryset=Event.objects.all(), view_name='event-detail')

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'event')
