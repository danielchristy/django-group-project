from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_func, name='login'),
    path('login/', views.login_func, name='login'),
    path('register/', views.register_func, name='register'),
    path('logout/', views.logout_func, name='logout'),
    path('home/', views.show_all_items, name='home_page'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
] 