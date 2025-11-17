from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count
from .models import QuizAttempt, QuestionAnswer


@login_required
def attempt_detail(request, pk):
    """View to display detailed results of a quiz attempt."""
    attempt = get_object_or_404(QuizAttempt, pk=pk)

    # Only allow viewing own attempts or teacher viewing their fiche attempts
    if attempt.student != request.user and attempt.fiche.author != request.user and not request.user.is_superuser:
        from django.contrib import messages
        from django.shortcuts import redirect
        messages.error(request, 'Vous n\'avez pas accès à ces résultats.')
        return redirect('dashboard')

    # Get all question answers with details
    question_answers = attempt.question_answers.select_related(
        'question', 'selected_answer'
    ).prefetch_related('question__answers').order_by('question__order')

    context = {
        'attempt': attempt,
        'question_answers': question_answers,
    }
    return render(request, 'results/attempt_detail.html', context)


@login_required
def my_results(request):
    """View for students to see their quiz history."""
    attempts = QuizAttempt.objects.filter(
        student=request.user
    ).select_related('fiche').order_by('-completed_at')

    # Statistics
    stats = {
        'total_attempts': attempts.count(),
        'average_score': attempts.aggregate(Avg('score'))['score__avg'] or 0,
        'passed_attempts': attempts.filter(score__gte=50).count(),
    }

    context = {
        'attempts': attempts,
        'stats': stats,
    }
    return render(request, 'results/my_results.html', context)


@login_required
def fiche_results(request, fiche_pk):
    """View for teachers to see all results for their fiche."""
    from fiches.models import Fiche
    fiche = get_object_or_404(Fiche, pk=fiche_pk)

    if fiche.author != request.user and not request.user.is_superuser:
        from django.contrib import messages
        from django.shortcuts import redirect
        messages.error(request, 'Vous ne pouvez voir que les résultats de vos propres fiches.')
        return redirect('fiches:detail', pk=fiche_pk)

    attempts = QuizAttempt.objects.filter(
        fiche=fiche
    ).select_related('student').order_by('-completed_at')

    # Statistics
    stats = {
        'total_attempts': attempts.count(),
        'unique_students': attempts.values('student').distinct().count(),
        'average_score': attempts.aggregate(Avg('score'))['score__avg'] or 0,
        'pass_rate': (attempts.filter(score__gte=50).count() / attempts.count() * 100) if attempts.count() > 0 else 0,
    }

    context = {
        'fiche': fiche,
        'attempts': attempts,
        'stats': stats,
    }
    return render(request, 'results/fiche_results.html', context)
