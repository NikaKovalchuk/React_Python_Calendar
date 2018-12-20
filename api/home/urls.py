from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

# urlpatterns = [
#     path(r'', views.HomePageView.as_view(), name="home"),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)

urlpatterns = [
    path(r'all/', views.api_root),
    path(r'', views.HomePageView.as_view(), name="home"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
