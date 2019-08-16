from django.contrib.auth.models import User,Group
from rest_framework import serializers

from .models import VueApi


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url','username','email','groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name','url')


class VueSerializer(serializers.ModelSerializer):
    class Meta:
        model = VueApi
        fields = ('id', 'number', 'name', 'add_time')
