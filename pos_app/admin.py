from django.contrib import admin
from pos_app.models import Item, Role, Promotions, CartItem, Transaction

class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'cost', 'department', 'amount', 'barcode')
    search_fields = ('name', 'department', 'barcode')
    list_filter = ('department',)

class RoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    search_fields = ('user__username', 'role')
    list_filter = ('role',)

admin.site.register(Item, ItemAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Promotions)
admin.site.register(CartItem)
admin.site.register(Transaction)
