from django.urls import path
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    # path('signup', views.SignUp.as_view()),
    # path('login', views.LogIn.as_view()),
    # path('logout', views.LogOut.as_view()),
    # path('account', views.Account.as_view()),
    path('api-auth/', include('rest_framework.urls')),
    path('<int:pk>', views.UserDetail.as_view()),
    path('', views.UserList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)