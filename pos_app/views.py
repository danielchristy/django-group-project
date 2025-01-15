from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from pos_app.forms import *
from pos_app.models import *

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
    return HttpResponse("Cannot perform task", status=400)