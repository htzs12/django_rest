from django.shortcuts import render
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.contrib.auth.models import User,Group
from rest_framework import viewsets
from .serializers import GroupSerializer,UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.get_queryset().order_by('id')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


