from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import StudentRegistrationForm, TeacherRegistrationForm, LoginForm


def register_choice(request):
    """View to choose registration type."""
    return render(request, 'accounts/register_choice.html')


def register_student(request):
    """View for student registration."""
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Inscription réussie ! Bienvenue sur SOUKLOU.')
            return redirect('dashboard')
    else:
        form = StudentRegistrationForm()
    return render(request, 'accounts/register_student.html', {'form': form})


def register_teacher(request):
    """View for teacher registration."""
    if request.method == 'POST':
        form = TeacherRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Inscription réussie ! Bienvenue sur SOUKLOU.')
            return redirect('dashboard')
    else:
        form = TeacherRegistrationForm()
    return render(request, 'accounts/register_teacher.html', {'form': form})


def login_view(request):
    """View for user login."""
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Bienvenue, {user.get_full_name() or user.username} !')
                return redirect('dashboard')
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    """View for user logout."""
    logout(request)
    messages.info(request, 'Vous avez été déconnecté avec succès.')
    return redirect('home')


@login_required
def profile(request):
    """View for user profile."""
    return render(request, 'accounts/profile.html')
