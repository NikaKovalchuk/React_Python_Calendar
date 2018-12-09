from rest_framework import serializers
from .models import Event
from api.user.serializers import UserSerializer

class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_users", many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'text', 'create_date', 'update_date', 'start_date', 'finish_date', 'status', 'price',
                  'archived', 'archived_date', 'user')