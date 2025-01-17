from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from pos_app.forms import *
from pos_app.models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_http_methods


def delete_all_items(request):
    if request.method == 'POST':
        Item.objects.all().delete()
        return HttpResponse("All items deleted")
    return HttpResponse("Cannot perform task", status=400)
    
def delete_item_by_id(request, item_id):
    if request.method == 'POST':
        item = get_object_or_404(Item, id=item_id)
        item.delete()
        return HttpResponse("Item deleted")
    
def login_func(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("inventory_page")
        else:
            messages.info(request, "Username or password is incorrect")
    
    return render(request, 'login.html')
        

def register_func(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def assign_role(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save() 
            return redirect('login')
    else:
        form = EmployeeForm()

    return render(request, 'assign_role.html', {'form': form})
        

def logout_func(request):
    logout(request)
    messages.success(request, "Logging out.")
    return redirect('login')
        
@login_required(login_url='login')
def show_all_items(request):
    items = Item.objects.all()
    return render(request, 'inventory.html', {'items': items})
        

#dded funcitonf the sales daniel made everytihgn apearts to wrok properly in sales
#the script is in static/js/sales.js
@login_required(login_url='login') #started adding login requited tosome specif pagess  
#if they arent logged them wont get error it will just redirect them to the login page
def sales_func(request):
    return render(request, 'sales.html')



        
#http://127.0.0.1:8000/admin-dashboard/ to avess the main admmin page currenalt have it as admin but can be changed to the manager or 
#or owner adming whre they have higher privilages than the employee 
#if you know of a simpler way byt all means EDIT THIS HOW YOU WANT!!!
#the main admin user is both a staff and a superuser 
@staff_member_required(login_url='login')
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')
        

@require_http_methods(["DELETE", "GET", "PUT"])
def item_detail(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        if request.method == "DELETE":
            item.delete()
            return JsonResponse({"message": "Item deleted successfully"})
        # ... other methods will be added later ...
    except Item.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)
        
