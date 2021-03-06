"""django_rest URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
# from rest_framework_swagger.views import get_swagger_view
from demo import views


router = routers.DefaultRouter()
router.register('users', views.UserViewSet)
router.register('groups', views.GroupViewSet)

# schema_view = get_swagger_view(title='mydocs')

urlpatterns = [
    path('',include(router.urls)),
    path('snippets/',include('snippets.urls')),
    path('demo/',include('demo.urls')),
    # path('docs/',include_docs_urls(title='demo')),
    # path('docs/',schema_view),
    path('api-auth/',include('rest_framework.urls',namespace='rest_framework')),
    path('admin/', admin.site.urls),
]
