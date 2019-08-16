import json

from django.shortcuts import render
from rest_framework.views import APIView
from django.forms.models import model_to_dict
from django.contrib.auth.models import User,Group
from rest_framework import viewsets
from .serializers import GroupSerializer,UserSerializer, VueSerializer
from django.views.generic.base import View
from django.http import JsonResponse

from .models import VueApi


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


class BuyCarView(View):
    def get(self, request):
        return render(request, 'buy_car.html')


class VueApiView(View):
    def get(self, request):
        vue_data = VueApi.objects.all()
        serializer = VueSerializer(vue_data, many=True)
        data = serializer.data
        data = {'data': data}
        return JsonResponse(data=data)

    def post(self, request):
        name = request.POST.get('name', '')
        id = request.POST.get('id', '')
        if name:
            id = request.POST.get('id', '5')
            vue = VueApi()
            vue.number = id
            vue.name = name
            vue.save()
        else:
            VueApi.objects.get(id=id).delete()
        return JsonResponse(data={'msg': '保存成功'})
