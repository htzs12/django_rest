# Generated by Django 2.2.3 on 2019-08-16 14:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demo', '0003_auto_20190816_1456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vueapi',
            name='add_time',
            field=models.DateTimeField(default=datetime.datetime.now, verbose_name='添加时间'),
        ),
    ]