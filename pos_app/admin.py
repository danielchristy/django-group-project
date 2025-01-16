from django.contrib import admin
from .models import Item, Promotions
#setup so we can manually edit item in the admin the user is lowercase admin pass is 1234
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'tag', 'amount')
    search_fields = ('name', 'tag')

@admin.register(Promotions)
class PromotionsAdmin(admin.ModelAdmin):
    list_display = ('item', 'quantity', 'discount')
    search_fields = ('item__name',)
