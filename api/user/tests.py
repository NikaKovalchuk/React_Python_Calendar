from django.test import TestCase

from api.user.models import User
from .views import RegistrationAPI, LoginAPI


class AuthData:
    username = ""
    password = ""


class AuthRequest:
    data = AuthData()
    user = None


class UserTestCase(TestCase):
    def setUp(self):
        test_user = User.objects.create(username='test_user', password="test_password")
        test_user2 = User.objects.create(username='test_user2', password="test_password")

    def checkRegistration(self, username, password):
        request = AuthRequest()
        request.data = {'username': username, 'password': password}
        response = RegistrationAPI.post(RegistrationAPI, request)
        print(response)

    def checkLoginAPI(self, username, password):
        request = AuthRequest()
        request.data = {'username': username, 'password': password}
        response = LoginAPI.post(LoginAPI, request)
        print(response)

    def check(self):
        self.checkRegistration('new_test_user', 'test_password')
        self.checkLoginAPI('new_test_user', 'test_password')
