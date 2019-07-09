from rest_framework import serializers

from api.event_calendar.serializers import CalendarSerializer
from api.user.serializers import UserSerializer
from .models import Event, Calendar


class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_user", read_only=True)
    calendar = CalendarSerializer(source="get_calendar", read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'text', 'start_date', 'finish_date',
                  'is_archived', 'user', 'repeat_type', 'notification_type', 'notice', 'calendar')


class ExportEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'repeat_type')


class NewEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'repeat_type', 'notification_type', 'notice')

    def validate(self, value):
        if value['start_date']:
            if value['finish_date']:
                if value['start_date'] > value['finish_date']:
                    raise serializers.ValidationError("finish must occur after start")
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        calendar = Calendar.objects.get(id=int(self.context['data']['calendar']['id']))
        validated_data['calendar'] = calendar
        return Event.objects.create(**validated_data)
