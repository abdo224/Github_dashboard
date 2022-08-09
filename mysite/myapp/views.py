from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from .forms import UserRegisterForm


def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(
                request, f'Account Created For {username} !, you are be able to log in !')
            return redirect('login')

    else:
        form = UserRegisterForm()
    return render(request, 'myapp/register.html', {'form': form})


@login_required
def profileCommits(request):

    return render(request, 'myapp/profileCommits.html')


@login_required
def profileFolders(request):
    return render(request, 'myapp/profileFolders.html')
