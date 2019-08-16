from datetime import datetime

from django.db import models


class Book(models.Model):
    title=models.CharField(max_length=32)
    price=models.IntegerField()
    pub_date=models.DateField()
    publish=models.ForeignKey("Publish",on_delete=models.CASCADE)
    authors=models.ManyToManyField("Author")

    def __str__(self):
        return self.title


class Publish(models.Model):
    name=models.CharField(max_length=32)
    email=models.EmailField()

    def __str__(self):
        return self.name


class Author(models.Model):
    name=models.CharField(max_length=32)
    age=models.IntegerField()

    def __str__(self):
        return self.name


class VueApi(models.Model):
    number = models.IntegerField(verbose_name='产品id')
    name = models.CharField(max_length=32, verbose_name='产品名')
    add_time = models.DateTimeField(default=datetime.now, verbose_name='添加时间')

    def __str__(self):
        return self.name

