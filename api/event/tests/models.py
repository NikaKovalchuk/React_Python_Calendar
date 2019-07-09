from django.test import TestCase
from django.utils import timezone

from api.event.models import Event
from api.event_calendar.models import Calendar
from api.user.models import User


class EventModelCreationTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(username='TestUser')
        self.test_calendar = Calendar.objects.create(
            title="event_calendar", user=self.test_user)
        Event.objects.create(title="Test1", text="text",
                             user=self.test_user,
                             calendar=self.test_calendar)

    def test_event_creation(self):
        Event.objects.create(
            title="Test", text="text",
            user=self.test_user, calendar=self.test_calendar)
        result = Event.objects.get(title="Test")
        expected_result = "text"
        self.assertEqual(expected_result, result.text)

    def test_start_and_finish_dates(self):
        result = Event.objects.get(title="Test1")
        start_date = result.start_date.replace(second=0, microsecond=0)
        finish_date = result.finish_date.replace(second=0, microsecond=0)
        self.assertEqual(start_date, finish_date)

    def test_create_and_update_dates(self):
        result = Event.objects.get(title="Test1")
        update_date = result.update_date.replace(second=0, microsecond=0)
        create_date = result.create_date.replace(second=0, microsecond=0)
        self.assertEqual(update_date, create_date)

    def test_event_str(self):
        result = Event.objects.get(title="Test1")
        self.assertEqual(result.title, str(result))


class EventModelDeleteTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(username='TestUser1')
        self.test_calendar = Calendar.objects.create(
            title="event_calendar", user=self.test_user)
        Event.objects.create(title="Test1", text="text",
                             user=self.test_user,
                             calendar=self.test_calendar)

    def test_archived_flag(self):
        event = Event.objects.get(title="Test1")
        event.delete()
        self.assertTrue(event.is_archived)

    def test_archived_flag_for_deleted_event(self):
        event = Event.objects.get(title="Test1")
        event.delete()
        self.assertRaises(PermissionError, event.delete)

    def test_archived_date(self):
        event = Event.objects.get(title="Test1")
        event.delete()
        result = event.archived_date.replace(second=0, microsecond=0)
        expected_result = (timezone.now()).replace(second=0, microsecond=0)
        self.assertEqual(result, expected_result)

    def test_updated_date(self):
        event = Event.objects.get(title="Test1")
        event.delete()
        result = event.update_date.replace(second=0, microsecond=0)
        expected_result = (timezone.now()).replace(second=0, microsecond=0)
        self.assertEqual(result, expected_result)
