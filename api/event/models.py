from django.db import models
from django.utils import timezone

from api.user.models import User


class Calendar(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    color = models.CharField(max_length=7, null=False, default="#4f5b69")
    access = models.IntegerField(default=0, blank=True, null=True)
    show = models.BooleanField(null=True, blank=True, default=True)

    create_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    update_date = models.DateTimeField(default=timezone.now, blank=True, null=True)

    archived = models.BooleanField(null=True, blank=True, default=False)
    archived_date = models.DateTimeField(blank=True, null=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('create_date', 'name')

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    def get_user(self):
        return self.user

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None, *args, **kwargs):
        self.update_date = timezone.now()
        super(Calendar, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        self.archived = True
        self.archived_date = timezone.now()
        self.show = False
        self.save()



class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=False)
    text = models.TextField(max_length=1000, null=False, blank=True)

    create_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    update_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    start_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    finish_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    repeat = models.IntegerField(default=0, blank=True, null=True)

    archived = models.BooleanField(null=True, blank=True, default=False)
    archived_date = models.DateTimeField(blank=True, null=True)

    notification = models.IntegerField(default=0, blank=True, null=True)
    notice = models.BooleanField(null=False, blank=False, default=False)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('create_date', 'title')

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None, *args, **kwargs):
        self.update_date = timezone.now()
        super(Event, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        self.archived = True
        self.archived_date = timezone.now()
        self.save()

    def get_user(self):
        return self.user

    def get_calendar(self):
        return self.calendar
