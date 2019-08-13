from django.urls import path
from . import views


app_name = 'demo'


urlpatterns = [
    path('', views.VueView.as_view(), name='vue'),
    path('a1/', views.DemoView.as_view(), name='a1'),
    path('buy/', views.BuyCarView.as_view(), name='buy'),
]
