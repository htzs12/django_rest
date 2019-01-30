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
    path('<int:pk>/',views.SnippetDetailView.as_view()),

    path('demo/',views.SnippetList.as_view()),
    path('demo1/',views.SnippetList1.as_view()),
    path('demo1/<int:pk>/',views.SnippetDetail1.as_view()),

    path('users/',views.UserList.as_view()),
    path('users/<int:pk>/',views.Userdetail.as_view())
]


urlpatterns = format_suffix_patterns(urlpatterns)