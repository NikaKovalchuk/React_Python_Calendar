# Generated by Django 2.1.4 on 2018-12-04 14:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('text', models.TextField(blank=True, max_length=1000)),
                ('create_date', models.DateTimeField(blank=True, default=datetime.datetime.utcnow, null=True)),
                ('update_date', models.DateTimeField(blank=True, default=datetime.datetime.utcnow, null=True)),
                ('start_date', models.DateTimeField(blank=True, default=datetime.datetime.utcnow, null=True)),
                ('finish_date', models.DateTimeField(blank=True, default=datetime.datetime.utcnow, null=True)),
                ('status', models.IntegerField(blank=True, default=1)),
                ('price', models.IntegerField(blank=True, null=True)),
            ],
        ),
    ]
