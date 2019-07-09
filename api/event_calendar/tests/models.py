from django.test import TestCase
from django.utils import timezone

from api.event.models import Event
from api.event_calendar.models import Calendar
from api.user.models import User


class CalendarModelCreationTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(username='TestUser')
        self.test_calendar = Calendar.objects.create(
            title="Test1", user=self.test_user)

    def test_calendar_str(self):
        result = Calendar.objects.get(title="Test1")
        self.assertEqual(result.title, str(result))

    def test_default_public_flag(self):
        result = Calendar.objects.get(title="Test1")
        self.assertFalse(result.is_public)

    def test_default_show_flag(self):
        result = Calendar.objects.get(title="Test1")
        self.assertTrue(result.show)

    def test_default_archived_flag(self):
        result = Calendar.objects.get(title="Test1")
        self.assertFalse(result.is_archived)

    def test_create_and_update_dates(self):
        result = Calendar.objects.get(title="Test1")
        update_date = result.update_date.replace(second=0, microsecond=0)
        create_date = result.create_date.replace(second=0, microsecond=0)
        self.assertEqual(update_date, create_date)


class CalendarModelDeleteTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(username='TestUser')
        self.test_calendar = Calendar.objects.create(
            title="Test1", user=self.test_user)

    def test_archived_flag(self):
        result = Calendar.objects.get(title="Test1")
        result.delete()
        self.assertTrue(result.is_archived)

    def test_show_flag(self):
        result = Calendar.objects.get(title="Test1")
        result.delete()
        self.assertTrue(result.show)

    def test_archived_date(self):
        calendar = Calendar.objects.get(title="Test1")
        calendar.delete()
        result = calendar.archived_date.replace(second=0, microsecond=0)
        expected_result = (timezone.now()).replace(second=0, microsecond=0)
        self.assertEqual(result, expected_result)

    def test_updated_date(self):
        calendar = Calendar.objects.get(title="Test1")
        calendar.delete()
        result = calendar.update_date.replace(second=0, microsecond=0)
        expected_result = (timezone.now()).replace(second=0, microsecond=0)
        self.assertEqual(result, expected_result)

    def test_delete_for_deleted_event(self):
        calendar = Calendar.objects.get(title="Test1")
        calendar.delete()
        self.assertRaises(PermissionError, calendar.delete)


class CalendarModelCopyTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create(username='TestUser')
        self.test_user_2 = User.objects.create(username='TestUser2')
        self.test_calendar = Calendar.objects.create(
            title="Test1", user=self.test_user)
        Event.objects.create(title="Test1", text="text",
                             user=self.test_user,
                             calendar=self.test_calendar)

    def test_user(self):
        calendar = Calendar.objects.get(title="Test1")
        copied_calendar = calendar.copy(self.test_user_2)
        self.assertEqual(copied_calendar.user, self.test_user_2)

    def test_public_flag(self):
        calendar = Calendar.objects.get(title="Test1")
        copied_calendar = calendar.copy(self.test_user_2)
        self.assertFalse(copied_calendar.is_public)

    def test_show_flag(self):
        calendar = Calendar.objects.get(title="Test1")
        copied_calendar = calendar.copy(self.test_user_2)
        self.assertTrue(copied_calendar.show)
