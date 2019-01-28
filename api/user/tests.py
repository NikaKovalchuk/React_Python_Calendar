from datetime import datetime
from django.test import TestCase
from api.user.models import User
from .views import RegistrationAPI, LoginAPI, CurrentUser


class AuthData:
    username = ""
    password = ""

class AuthRequest:
    data = AuthData()
    user = None

class UserTestCase(TestCase):
    def setUp(self):
        TestUser = User.objects.create(username='TestUser', password="testPassword")
        TestUser2 = User.objects.create(username='TestUser2', password="testPassword")

    def checkRegistration(self, username, password):
        request = AuthRequest()
        request.data = {'username' : username, 'password': password}
        response = RegistrationAPI.post(RegistrationAPI,request)
        print(response)

    def checkLoginAPI(self, username, password):
        request = AuthRequest()
        request.data = {'username': username, 'password': password}
        response = LoginAPI.post(LoginAPI, request)
        print(response)


    def check(self):
        self.checkRegistration('NewTestUser','testPassword')
        self.checkLoginAPI('NewTestUser','testPassword')