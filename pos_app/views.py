from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from pos_app.forms import *
from pos_app.models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt


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
            print(user.is_superuser)
            if user.is_superuser:
                return redirect('admin_dashboard')
            else:
                return redirect("inventory_page")
        else:
            messages.info(request, "Username or password is incorrect")
    
    return render(request, 'login.html')
        

def register_func(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            name = request.POST.get('username')
            password = request.POST.get('password1')
            if name == "admin" and password == "adminaccess":
                if not User.objects.filter(username="admin").exists():
                    User.objects.create_superuser(username="admin", password="adminaccess")
                    messages.success(request, "Superuser created.")
                    return redirect('login')
                else:
                    messages.info(request, "User already exists.")
                    return redirect('login')
            else:
                form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

@user_passes_test(lambda u: u.is_superuser, login_url='login')
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
        
def is_superuser(user):
    return user.is_superuser

@login_required
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
        

@require_http_methods(["GET", "PUT", "DELETE"])
def item_detail(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        
        if request.method == "GET":
            return JsonResponse({
                'id': item.id,
                'name': item.name,
                'cost': float(item.cost),
                'department': item.department,
                'amount': item.amount,
                'barcode': item.barcode
            })
            
        elif request.method == "PUT":
            data = json.loads(request.body)
            item.cost = data.get('cost', item.cost)
            item.department = data.get('department', item.department)
            item.amount = data.get('amount', item.amount)
            item.barcode = data.get('barcode', item.barcode)
            item.save()
            return JsonResponse({'message': 'Item updated successfully'})
            
        elif request.method == "DELETE":
            item.delete()
            return JsonResponse({'message': 'Item deleted successfully'})
            
    except Item.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
        

@require_http_methods(["POST"])
def create_item(request):
    try:
        data = json.loads(request.body)
        barcode = data.get('barcode')
        if Item.objects.filter(barcode=barcode).exists():
            return JsonResponse({
                'error': 'This barcode is already in use.'
            }, status=400)
        item = Item.objects.create(
            name=data['name'],
            cost=data['cost'],
            department=data['department'],
            amount=data['amount'],
            barcode=data['barcode']
        )
        return JsonResponse({
            'message': 'Item created successfully',
            'id': item.id
        }, status=201)
    except KeyError as e:
        return JsonResponse({
            'error': f'Missing required field: {str(e)}'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)
        
##testing stuff for the search feature on the main pos screene
@csrf_exempt
def search_item(request):
    print("Search view called")  # Debug log
    print("Request method:", request.method)  # Debug log
    print("Request GET params:", request.GET)  # Debug log
    
    barcode = request.GET.get('barcode')
    print(f"Searching for barcode: {barcode}")  # Debug log
    
    try:
        item = Item.objects.get(barcode=barcode)
        print(f"Found item: {item.name}")  # Debug log
        
        response_data = {
            'id': item.id,
            'name': item.name,
            'cost': float(item.cost),
            'department': item.department,
            'amount': item.amount,
            'barcode': item.barcode
        }
        print("Sending response:", response_data)  # Debug log
        return JsonResponse(response_data)
        
    except Item.DoesNotExist:
        print(f"No item found with barcode: {barcode}")  # Debug log
        return JsonResponse({'error': 'Item not found'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return JsonResponse({'error': str(e)}, status=400)
        
#this is for the pin to swtich user i have it currently mapped to the hyperinlin on top that aays 
#switch user once you figure out wher eyou want it you can used this fucntion and the assing role.thml
#just wantedot have soemthing s
@login_required
def change_user(request):
    if request.method == 'POST':
        pin = request.POST.get('manager_pin')
        if pin == '1234': #temporary oin we are using 
            return redirect('role')  # Redirect to role selection
        else:
            return render(request, 'change_user.html', {'error': 'Invalid PIN'})
    return render(request, 'change_user.html')
        

@login_required
def home_page(request):
    return render(request, 'home.html')