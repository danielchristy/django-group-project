from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator

class Item(models.Model):
    name = models.CharField(max_length=50)
    cost = models.DecimalField(decimal_places=2, max_digits=6)
    tag = models.CharField(max_length=50)
    amount = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.tag})"

class Promotions(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    discount = models.DecimalField(max_digits=3, decimal_places=2, validators=[MaxValueValidator(1)])

class Roles(models.Model):
    user = models.ForeignKey(on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
