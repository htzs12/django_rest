from django.urls import path,include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from snippets import views

app_name = 'snippets'

urlpatterns = [
    path('',views.index),
]