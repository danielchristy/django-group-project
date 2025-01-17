from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.login_func, name='login'),
    path('login/', views.login_func, name='login'),
    path('register/', views.register_func, name='register'),
    path('logout/', views.logout_func, name='logout'),
    path('inventory/', views.show_all_items, name='inventory_page'),
    path('sales/', views.sales_func, name='sales'),
    path('role/', views.assign_role, name='role'),
    
    
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
] 