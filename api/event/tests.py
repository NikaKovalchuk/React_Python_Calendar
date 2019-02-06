from django.test import TestCase

from api.event.models import Event, Calendar
from api.user.models import User


class EventModelTestCase(TestCase):

    def setUp(self):
        test_user = User.objects.create(username='test_user')
        test_user2 = User.objects.create(username='test_user2')

        test_calendar = Calendar.objects.create(name="calendar", user=test_user)

        Event.objects.create(title="Test1", text="text", user=test_user, calendar=test_calendar)
        Event.objects.create(title="Test2", text="TEXT", repeat=2, notification=1, user=test_user2,
                             calendar=test_calendar)

    def check_сreation(self, title='Test1', text='text', username='TestUser'):
        test = Event.objects.get(title=title)
        print("Tested event \"" + title + "\"")
        if test.text == text:
            print("\"" + title + "\" text created correctly")
        else:
            print("Error!Unexpected \"" + title + "\" text. Expected \"" + text + "\" but get " + test.text)
        user = User.objects.get(username=username)
        if test.user == user:
            print("\"" + title + "\" user stored correctly.")
        else:
            print(
                "Error!Unexpected \"" + title + "\" user. Expected \"" + username + "\" but get " + test.user.username)

        start_date = test.start_date.replace(second=0, microsecond=0)
        finish_date = test.finish_date.replace(second=0, microsecond=0)
        if start_date == finish_date:
            print("\"" + title + "\" dates (start_date and finish_date) automatically created correctly")
        else:
            print(
                "Error with \"" + title + "\" dates. Expected that they would be equal but they are not.Start time"
                + test.start_date.__str__() + ". Finish time " + test.finish_date.__str__())

        update_date = test.update_date.replace(second=0, microsecond=0)
        create_date = test.create_date.replace(second=0, microsecond=0)
        if update_date == create_date:
            print("\"" + title + "\" dates (update_date and create_date) automatically created correctly")
        else:
            print(
                "Error with \"" + title + "\" dates. Expected that they would be equal but they are not.Start time"
                + test.update_date.__str__() + ". Finish time " + test.create_date.__str__())

    def check_get_user(self, title, username):
        user = Event.objects.get(title=title).get_user()
        if user == User.objects.get(username=username):
            print("get_user function works correctly for \"" + title + "\".")
        else:
            print("Unexpected \"" + title + "\" user. Expected \"" + username + "\" but get " + user.username)

    def check_delete(self, title):
        event = Event.objects.get(title=title)
        event.delete()
        if event.archived:
            print("\"" + title + "\" deleted correctly.")
        else:
            print("Error! \"" + title + "\" not deleted.")

    def check(self):
        print("checkCreation")
        self.check_сreation(title='Test1', username='TestUser')
        self.check_сreation(title='Test2', text='TEXT', username='TestUser2')
        print("checkCreation   ERRORS ")
        self.check_сreation(title='Test1', text='TEXT', username='TestUser2')
        self.check_сreation(title='Test2', username='TestUser')

        print("\ncheckGetUser")
        self.check_get_user(title='Test1', username='TestUser')
        self.check_get_user(title='Test2', username='TestUser2')
        print("checkGetUser   ERRORS ")
        self.check_get_user(title='Test1', username='TestUser2')
        self.check_get_user(title='Test2', username='TestUser')

        print("\ncheckDelete")
        self.check_delete(title='Test1')
        self.check_delete(title='Test2')
