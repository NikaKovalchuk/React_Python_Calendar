from django.db import models
from django.utils import timezone

from api.user.models import User


class Calendar(models.Model):
    title = models.CharField(max_length=100, null=False)
    color = models.CharField(max_length=7, null=False, default="#000000")
    is_public = models.BooleanField(null=False, blank=False, default=False)
    show = models.BooleanField(null=True, blank=True, default=True)

    is_archived = models.BooleanField(null=True, blank=True, default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('title',)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def get_user(self):
        return self.user

    def delete(self):
        if not self.is_archived:
            self.show = False
            self.is_archived = True
            self.archived_date = timezone.now()
            self.save()
        else:
            raise PermissionError

    def copy(self, user):
        from api.event.models import Event
        events = Event.objects.filter(calendar_id=self.id)
        self.pk = None
        self.user = user
        self.is_public = False
        self.save()
        for event in events:
            event.pk = None
            event.user = user
            event.notice = False
            event.calendar = self
            event.save()
