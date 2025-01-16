from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator

class Item(models.Model):
    name = models.CharField(max_length=50)
    cost = models.DecimalField(decimal_places=2, max_digits=6)
    #upated tag to department
    department = models.CharField(max_length=50)
    amount = models.IntegerField()
    barcode = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.name} ({self.department})"

class Promotions(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    discount = models.DecimalField(max_digits=3, decimal_places=2, validators=[MaxValueValidator(1)])

class Roles(models.Model):
    #had to add user to the model as it was not working without it atleast on my end
    #let me know if it runs on yours without it-faust
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    name = models.CharField(max_length=50)


#code for the cart item thing hhavent coded it just yet
class CartItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total = models.DecimalField(decimal_places=2, max_digits=10)

    def save(self, *args, **kwargs):
        self.total = self.item.cost * self.quantity
        super().save(*args, **kwargs)

# remember to nuke the migrations and run makemigrations again since we updated the tag to department
#it borks the original migration with tags
#oh and the referecent thing in the admin file too let me kknow if you have issues with it
#dont delted __init__in migration just evertying else
#delete all the stuff in migrations foler adn the db.sqlit3 file then migrate again 
#basic model of the notes daniel mentioned for doing the math for the totals
#make sure migrate before running the code
#if anyone notifces on errors please let us know in case it doenst run on some and we can catth them in time
class Transaction(models.Model):
    cart_items = models.ManyToManyField(CartItem)
    date = models.DateTimeField(auto_now_add=True)
    tax_rate = models.DecimalField(default=0.07, max_digits=4, decimal_places=3)
    discount_rate = models.DecimalField(default=0.0, max_digits=4, decimal_places=3)
    subtotal = models.DecimalField(decimal_places=2, max_digits=10)
    tax_total = models.DecimalField(decimal_places=2, max_digits=10)
    discount_total = models.DecimalField(decimal_places=2, max_digits=10)
    grand_total = models.DecimalField(decimal_places=2, max_digits=10)

    def calculate_totals(self):
        self.subtotal = sum(item.total for item in self.cart_items.all())
        self.tax_total = self.subtotal * self.tax_rate
        self.discount_total = self.subtotal * self.discount_rate
        self.grand_total = self.subtotal + self.tax_total - self.discount_total
        self.save()
