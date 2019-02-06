from rest_framework import serializers

from api.user.serializers import UserSerializer
from .models import Calendar


class NewCalendarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calendar
        fields = ('name', 'color', 'public', 'show')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Calendar.objects.create(**validated_data)


class CalendarSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(source="get_user", read_only=True)

    class Meta:
        model = Calendar
        fields = ('id', 'name', 'color', 'public', 'show', 'user')