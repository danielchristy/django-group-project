from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_func, name='login'),
    path('register/', views.register_func, name='register'),
    path('logout/', views.logout_func, name='logout'),
] 