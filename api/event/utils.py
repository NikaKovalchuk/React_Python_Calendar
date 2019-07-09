import copy
import datetime
from datetime import datetime, timedelta, date

from api.event.enums import EventRepeatEnum, EventNotificationEnum
from api.event.models import Event


def repeated_events(self, start_date, finish_date, events, user, calendars_id):
    extra = Event.objects.filter(
        user=user.id,
        archived=False,
        repeat__isnull=False,
        calendar_id__in=calendars_id
    )

    for event in extra:
        checked_start_date = start_date - timedelta(
            days=(event.finish_date - event.start_date).days)
        while checked_start_date < finish_date:
            new_event = copy.copy(event)
            new_event.start_date = checked_start_date.replace(
                hour=new_event.start_date.hour,
                minute=new_event.start_date.minute)
            finish_checked_date = checked_start_date + timedelta(
                days=abs(
                    event.start_date.date() - event.finish_date.date()).days)
            new_event.finish_date = finish_checked_date.replace(
                hour=new_event.finish_date.hour,
                minute=new_event.finish_date.minute)
            if event.repeat == EventRepeatEnum.DAY:
                events.append(new_event)
            if event.repeat == EventRepeatEnum.WEEK:
                if abs(
                        event.start_date.date() - checked_start_date.date()).days % 7 == 0:
                    events.append(new_event)
            if event.repeat == EventRepeatEnum.MONTH:
                if event.start_date.day == checked_start_date.day:
                    events.append(new_event)
            if event.repeat == EventRepeatEnum.YEAR:
                if event.start_date.day == checked_start_date.day and event.start_date.month == checked_start_date.month:
                    events.append(new_event)
            checked_start_date = checked_start_date + timedelta(days=1)
    return events


def get_notification(self, events):
    result = []
    today = datetime.utcnow()
    for event in events:
        if abs(event.start_date.date() - today.date()).days <= 1:
            diff = datetime.combine(date.min,
                                    event.start_date.time()) - datetime.combine(
                date.min, today.time())
            if event.notice:
                if event.notification == EventNotificationEnum.DAY:
                    if diff.seconds < 60 * 60 * 24:
                        result.append(event)
                if event.notification == EventNotificationEnum.HOUR:
                    if diff.seconds < 60 * 60:
                        result.append(event)
                if event.notification == EventNotificationEnum.HALF_HOUR:
                    if diff.seconds < 60 * 30:
                        result.append(event)
                if event.notification == EventNotificationEnum.TEN_MINUTES:
                    if diff.seconds < 60 * 10:
                        result.append(event)
    return result
