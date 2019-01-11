from rest_framework import serializers

from api.user.serializers import UserSerializer
from .models import Event


class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_user", read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'text', 'start_date', 'finish_date', 'archived', 'user', 'cycle')

class ExportEventSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'archived', 'cycle')

class NewEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'cycle')

    def validate(self, value):
        if value['start_date']:
            if value['finish_date']:
                if value['start_date'] > value['finish_date']:
                    raise serializers.ValidationError("finish must occur after start")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Event.objects.create(**validated_data)