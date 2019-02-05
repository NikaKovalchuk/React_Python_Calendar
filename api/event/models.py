from django.db import models
from django.utils import timezone

from api.user.models import User


class Calendar(models.Model):
    name = models.CharField(max_length=100, null=False)
    color = models.CharField(max_length=7, null=False, default="#000000")
    public = models.BooleanField(null=False, blank=False, default=False)
    show = models.BooleanField(null=True, blank=True, default=True)

    archived = models.BooleanField(null=True, blank=True, default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('create_date', 'name')

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    def get_user(self):
        return self.user

    def delete(self, using=None, keep_parents=False):
        self.archived = True
        self.archived_date = timezone.now()
        self.show = False
        self.save()

    def copy(self, user):
        events = Event.objects.filter(calendar_id=self.id)
        self.pk = None
        self.user = user
        self.public = False
        self.save()
        for event in events:
            event.pk = None
            event.user = user
            event.notice = False
            event.calendar = self
            event.save()


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
