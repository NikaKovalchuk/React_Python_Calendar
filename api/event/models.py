from datetime import datetime

from django.db import models


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=False)
    text = models.TextField(max_length=1000, null=False, blank=True)
    create_date = models.DateTimeField(default=datetime.now, blank=True, null=True)
    update_date = models.DateTimeField(default=datetime.now, blank=True, null=True)
    start_date = models.DateTimeField(default=datetime.now, blank=True, null=True)
    finish_date = models.DateTimeField(default=datetime.now, blank=True, null=True)
    status = models.IntegerField(default=1, null=False, blank=True)
    price = models.IntegerField(null=True, blank=True)

    archived = models.BooleanField(null=True, blank=True, default=False)
    archived_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ('create_date',)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None, *args, **kwargs):
        self.update_date = datetime.now()
        super(Event, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        self.archived = True
        self.archived_date = datetime.now()
        self.save()

    def get_users(self):
        return self.user_set
