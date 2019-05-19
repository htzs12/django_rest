from django.urls import path
from .views import VueView


app_name = 'demo'


urlpatterns = [
    path('', VueView.as_view(), name='vue'),
]