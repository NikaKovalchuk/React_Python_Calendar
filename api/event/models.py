from django.db import models
from django.utils import timezone

from api.event_calendar.models import Calendar
from api.user.models import User


class Event(models.Model):
    title = models.CharField(max_length=100, null=False)
    text = models.TextField(max_length=1000, null=False, blank=True)
    start_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    finish_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    repeat = models.IntegerField(default=0, blank=True, null=True)
    notification = models.IntegerField(default=0, blank=True, null=True)

    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    notice = models.BooleanField(null=False, blank=False, default=False)
    archived = models.BooleanField(null=True, blank=True, default=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)

    class Meta:
        ordering = ('create_date', 'title')

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def delete(self, using=None, keep_parents=False):
        self.archived = True
        self.archived_date = timezone.now()
        self.save()

    def get_user(self):
        return self.user

    def get_calendar(self):
        return self.calendar
