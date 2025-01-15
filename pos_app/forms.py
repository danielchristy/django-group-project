from django import forms
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