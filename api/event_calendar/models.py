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
        ordering = ('-update_date', 'name')

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
        from api.event.models import Event
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
