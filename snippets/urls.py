from django.urls import path,include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework.urlpatterns import format_suffix_patterns
from snippets import views

app_name = 'snippets'

urlpatterns = [
    # path('',views.smippet_list),
    # path('<int:pk>/',views.snippet_detail),
    path('',views.SnippetListView.as_view()),
    path('<int:pk>/',views.SnippetDetailView.as_view())
]


urlpatterns = format_suffix_patterns(urlpatterns)