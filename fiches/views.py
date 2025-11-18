from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q, Count
from .models import Fiche
from .forms import FicheForm


def fiche_list(request):
    """View to list all published fiches."""
    fiches = Fiche.objects.filter(is_published=True).select_related('author').annotate(
        quiz_count=Count('questions')
    )

    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        fiches = fiches.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__icontains=search_query)
        )

    # Filter by category
    category = request.GET.get('category', '')
    if category:
        fiches = fiches.filter(category=category)

    # Get all unique categories for filter
    categories = Fiche.objects.filter(is_published=True).values_list('category', flat=True).distinct()

    context = {
        'fiches': fiches,
        'search_query': search_query,
        'selected_category': category,
        'categories': categories,
    }
    return render(request, 'fiches/fiche_list.html', context)


def fiche_detail(request, pk):
    """View to display a single fiche."""
    fiche = get_object_or_404(Fiche, pk=pk, is_published=True)
    fiche.increment_views()

    # Get quiz info
    questions = fiche.questions.all().prefetch_related('answers')
    has_quiz = questions.exists()

    # Get user's previous attempts if logged in
    user_attempts = None
    if request.user.is_authenticated:
        user_attempts = fiche.attempts.filter(student=request.user).order_by('-completed_at')[:5]

    context = {
        'fiche': fiche,
        'has_quiz': has_quiz,
        'question_count': questions.count(),
        'user_attempts': user_attempts,
    }
    return render(request, 'fiches/fiche_detail.html', context)


@login_required
def fiche_create(request):
    """View for teachers to create a new fiche."""
    if not request.user.is_teacher:
        messages.error(request, 'Seuls les enseignants peuvent créer des fiches.')
        return redirect('fiches:list')

    if request.method == 'POST':
        form = FicheForm(request.POST)
        if form.is_valid():
            fiche = form.save(commit=False)
            fiche.author = request.user
            fiche.save()
            messages.success(request, 'Fiche créée avec succès !')
            return redirect('fiches:detail', pk=fiche.pk)
    else:
        form = FicheForm()

    return render(request, 'fiches/fiche_form.html', {'form': form, 'action': 'Créer'})


@login_required
def fiche_update(request, pk):
    """View for teachers to update their fiche."""
    fiche = get_object_or_404(Fiche, pk=pk)

    if fiche.author != request.user and not request.user.is_superuser:
        messages.error(request, 'Vous ne pouvez modifier que vos propres fiches.')
        return redirect('fiches:detail', pk=pk)

    if request.method == 'POST':
        form = FicheForm(request.POST, instance=fiche)
        if form.is_valid():
            form.save()
            messages.success(request, 'Fiche mise à jour avec succès !')
            return redirect('fiches:detail', pk=pk)
    else:
        form = FicheForm(instance=fiche)

    return render(request, 'fiches/fiche_form.html', {'form': form, 'action': 'Modifier', 'fiche': fiche})


@login_required
def fiche_delete(request, pk):
    """View for teachers to delete their fiche."""
    fiche = get_object_or_404(Fiche, pk=pk)

    if fiche.author != request.user and not request.user.is_superuser:
        messages.error(request, 'Vous ne pouvez supprimer que vos propres fiches.')
        return redirect('fiches:detail', pk=pk)

    if request.method == 'POST':
        fiche.delete()
        messages.success(request, 'Fiche supprimée avec succès !')
        return redirect('fiches:list')

    return render(request, 'fiches/fiche_confirm_delete.html', {'fiche': fiche})
