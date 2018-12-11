from django.urls import path
from django.views import generic
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path(r'all/', views.api_root),
    path(r'', generic.TemplateView.as_view(template_name='view/home/home.html'), name="home"),
]

urlpatterns = format_suffix_patterns(urlpatterns)