from rest_framework import serializers
from .models import User
from api.event.models import Event

class UserSerializer(serializers.HyperlinkedModelSerializer):
    event = serializers.HyperlinkedRelatedField(many=True, queryset=Event.objects.all(), view_name='event-detail')

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'event')