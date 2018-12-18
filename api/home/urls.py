from django.urls import path
from django.views import generic
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

# urlpatterns = [
#     path(r'', views.HomePageView.as_view(), name="home"),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns = [
    path(r'all/', views.api_root),
]

urlpatterns = format_suffix_patterns(urlpatterns)