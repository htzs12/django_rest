from django.shortcuts import render
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.contrib.auth.models import User,Group
from rest_framework import viewsets
from .serializers import GroupSerializer,UserSerializer
from django.views.generic.base import View
from django.http import JsonResponse


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.get_queryset().order_by('id')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class VueView(View):
    def get(self, request):
        # print('"python.autoComplete.addBrackets": true,')
        return render(request, 'index.html')


class DemoView(View):
    def get(self, request):
        return render(request, 'demo.html')
