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
    path('api/item/<int:item_id>/', views.item_detail, name='item_detail'),
    path('api/item/', views.create_item, name='create_item'),
    path('change_user/', views.change_user, name='change_user'),
    path('api/item/search/', views.search_item, name='search_item'),
    path('search-item/', views.search_item, name='search_item'),
] 

# Add this print statement to debug
print("Available URLs:", [url.pattern for url in urlpatterns]) 