from django.contrib import admin
from pos_app.models import Item, Roles, Promotions, CartItem, Transaction

class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'department', 'amount', 'barcode')
    search_fields = ('name', 'department', 'barcode')
    list_filter = ('department',)

admin.site.register(Item, ItemAdmin)
admin.site.register(Roles)
admin.site.register(Promotions)
admin.site.register(CartItem)
admin.site.register(Transaction)
