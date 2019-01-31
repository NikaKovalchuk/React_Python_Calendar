from rest_framework import serializers

from api.user.serializers import UserSerializer
from .models import Event, Calendar


class NewCalendarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calendar
        fields = ('name', 'color', 'access', 'show')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Calendar.objects.create(**validated_data)


class CalendarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calendar
        fields = ('id', 'name', 'color', 'access', 'show')


class EventSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_user", read_only=True)
    calendar = CalendarSerializer(source="get_calendar", read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'text', 'start_date', 'finish_date',
                  'archived', 'user', 'repeat', 'notification', 'notice', 'calendar')


class ExportEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'repeat')


class NewEventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = ('title', 'text', 'start_date', 'finish_date', 'repeat', 'notification', 'notice')

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
