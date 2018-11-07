from django.db import models
from datetime import datetime

# Create your models here.
class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, null=False)
    text = models.TextField(max_length=1000, null=False, blank=True)
    create_date = models.DateTimeField(default=datetime.utcnow, blank=True, null=True)
    update_date = models.DateTimeField(default=datetime.utcnow, blank=True, null=True)
    start_date = models.DateTimeField(default=datetime.utcnow, blank=True, null=True)
    finish_date = models.DateTimeField(default=datetime.utcnow, blank=True, null=True)
    status = models.IntegerField(default=1, null=False, blank=True)
    price = models.IntegerField(null=True, blank=True)

    def __str__ (self):
        return self.title