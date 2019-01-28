# import os,django
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_rest.settings")# project_name 项目名称
# django.setup()

from django.shortcuts import render
from django.http import HttpResponse
from snippets.models import Snippet
from snippets.serializers import SnippetSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


def index(request):
    snippet = Snippet(code='foo = bar\n')
    snippet.save()

    snippet = Snippet(code='print "hello,world"\n')
    snippet.save()

    return HttpResponse('ok')
