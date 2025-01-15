from django import forms
<<<<<<< HEAD
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm







class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["username", "employee", "email", "password1", "password2"]
=======
from pos_app.models import *
from django.contrib.auth.models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class SignInForm(forms.Form):
    name = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    repeated_password = forms.CharField(widget=forms.PasswordInput)
    
    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data["password"] != cleaned_data["repeated_password"]:
            self.add_error("repeated_password", "Passwords must match")

        return cleaned_data
>>>>>>> 9fed705a252c76417e591d688e2b347db8955eaa
