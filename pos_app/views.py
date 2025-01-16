from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from pos_app.forms import *
from pos_app.models import *
from django.contrib.admin.views.decorators import staff_member_required


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
            return redirect("home_page")
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
        

def logout_func(request):
    logout(request)
    return redirect('login')
        

def show_all_items(request):
    items = Item.objects.all()
    return render(request, 'base.html', {'items': items})
        






        
#http://127.0.0.1:8000/admin-dashboard/ to avess the main admmin page currenalt have it as admin but can be changed to the manager or 
#or owner adming whre they have higher privilages than the employee 
#if you know of a simpler way byt all means EDIT THIS HOW YOU WANT!!!
#the main admin user is both a staff and a superuser 
@staff_member_required(login_url='login')
def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')
        
