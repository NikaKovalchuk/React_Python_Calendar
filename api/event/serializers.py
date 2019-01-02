from rest_framework import serializers

from api.user.serializers import UserSerializer
from .models import Event


class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_users", many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'text', 'start_date', 'finish_date', 'status', 'price', 'archived', 'user')

    def validate(self, value):
        if value['start_date']:
            if value['finish_date']:
                if value['start_date'] > value['finish_date']:
                    raise serializers.ValidationError("finish must occur after start")
        return value


class NewEventSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date')

    def validate(self, value):
        if value['start_date']:
            if value['finish_date']:
                if value['start_date'] > value['finish_date']:
                    raise serializers.ValidationError("finish must occur after start")
        return value

