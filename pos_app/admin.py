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
<<<<<<< HEAD
admin.site.register(Role)
=======
admin.site.register(Role, RoleAdmin)
>>>>>>> 1a172a042c421772382acfdc1f8b679595a07a5b
admin.site.register(Promotions)
admin.site.register(CartItem)
admin.site.register(Transaction)
