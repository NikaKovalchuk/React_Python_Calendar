from datetime import datetime

from django.test import TestCase

from api.user.models import User
from .models import Event


class EventModelTestCase(TestCase):

    def setUp(self):
        TestUser = User.objects.create(username='TestUser')
        TestUser2 = User.objects.create(username='TestUser2')
        Event.objects.create(title="Test1", text="text", user=TestUser)
        Event.objects.create(title="Test2", text="TEXT", repeat=2, notification=1, user=TestUser2)

    def checkCreation(self, title='Test1', text='text', username='TestUser'):
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
            print("Error!Unexpected \"" + title + "\" user. Expected \"" + username + "\" but get " + test.user.username)

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

    def checkGetUser(self, title, username):
        user = Event.objects.get(title=title).get_user()
        if user == User.objects.get(username=username):
            print("get_user function works correctly for \"" + title + "\".")
        else:
            print("Unexpected \"" + title + "\" user. Expected \"" + username + "\" but get " + user.username)

    def checkDelete(self, title):
        event = Event.objects.get(title = title)
        event.delete()
        if event.archived == True:
            print("\"" + title + "\" deleted correctly.")
        else:
            print("Error! \"" + title + "\" not deleted.")


    def check(self):
        print("checkCreation")
        self.checkCreation(title='Test1', username='TestUser')
        self.checkCreation(title='Test2', text='TEXT', username='TestUser2')
        print("checkCreation   ERRORS ")
        self.checkCreation(title='Test1', text='TEXT', username='TestUser2')
        self.checkCreation(title='Test2', username='TestUser1')

        print("\ncheckGetUser")
        self.checkGetUser(title='Test1', username='TestUser')
        self.checkGetUser(title='Test2', username='TestUser2')
        print("checkGetUser   ERRORS ")
        self.checkGetUser(title='Test1', username='TestUser2')
        self.checkGetUser(title='Test2', username='TestUser')

        print("\ncheckDelete")
        self.checkDelete(title='Test1')
        self.checkDelete(title='Test2')
