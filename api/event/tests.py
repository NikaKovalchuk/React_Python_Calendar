from rest_framework import status
from rest_framework.response import Response

from .views import EventList


# Create your tests here.
def test_EventList_get():
    if EventList.get() == Response(status=status.HTTP_401_UNAUTHORIZED):
        print("EventList.get() works fine for empty parameters")
    else:
        print("EventList.get() fails for empty parameters")
    if EventList.get({}) == Response(status=status.HTTP_401_UNAUTHORIZED):
        print("EventList.get() works fine for parameter {}")
    else:
        print("EventList.get() fails for parameter {}")
    if EventList.get(4) == Response(status=status.HTTP_401_UNAUTHORIZED):
        print("EventList.get() works fine for parameter 4")
    else:
        print("EventList.get() fails for parameter 4")

    user = {id: 4}
    request = {user: user}
    if EventList.get(request) == Response():
        print("EventList.get() works fine for parameter request just with user id")
    else:
        print("EventList.get() fails for parameter request  just with user id")
