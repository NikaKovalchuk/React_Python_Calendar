from rest_framework import status
from rest_framework.response import Response

from .views import EventList


# Create your tests here.
def test_EventList_get():
    user = lambda: None
    user.id = 4
    request = lambda: None
    request.user = user
    request.query_params = None
    if EventList.get(EventList, request=request) == Response():
        print("EventList.get() works fine for parameter request just with user id")
    else:
        print("EventList.get() fails for parameter request  just with user id")


test_EventList_get()