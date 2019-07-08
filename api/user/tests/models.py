from django.test import TestCase
from rest_framework.exceptions import ValidationError

from api.user.models import User
from api.user.views import RegistrationAPI, LoginAPI


class AuthData:
    username = ""
    password = ""


class AuthRequest:
    data = AuthData()
    user = None


class UserRegistrationTestCase(TestCase):

    def test_registration(self):
        request = AuthRequest()
        request.data = {'username': "test_user_1", 'password': "test_password"}
        response = RegistrationAPI.post(RegistrationAPI, request)
        self.assertEqual(response.status_code, 200)

    def test_registration_with_registered_username(self):
        request = AuthRequest()
        request.data = {'username': "test_user", 'password': "test_password"}
        registrate = lambda: RegistrationAPI.post(RegistrationAPI, request)
        self.assertRaises(ValidationError, registrate)


class UserLoginTestCase(TestCase):
    def setUp(self):
        User.objects.create(username='test_user', password="test_password")
        User.objects.create(username='test_user2',password="test_password")

    def test_login(self):
        request = AuthRequest()
        request.data = {'username': "test_user",
                        'password': "test_password"}
        response = LoginAPI.post(LoginAPI, request)
        self.assertEqual(response.status_code, 200)

    def test_login_with_invalid_username(self):
        request = AuthRequest()
        request.data = {'username': "test_user_1",
                        'password': "test_password"}
        login = lambda: LoginAPI.post(LoginAPI, request)
        self.assertRaises(ValidationError, login)

    def test_login_with_invalid_password(self):
        request = AuthRequest()
        request.data = {'username': "test_user",
                        'password': "test_password_q"}
        login = lambda: LoginAPI.post(LoginAPI, request)
        self.assertRaises(ValidationError, login)
