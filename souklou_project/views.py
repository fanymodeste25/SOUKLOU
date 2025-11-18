from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from fiches.models import Fiche
from results.models import QuizAttempt


def home(request):
    """Home page view."""
    if request.user.is_authenticated:
        return redirect('dashboard')

    # Get some featured fiches
    featured_fiches = Fiche.objects.filter(is_published=True).order_by('-views_count')[:6]

    context = {
        'featured_fiches': featured_fiches,
    }
    return render(request, 'home.html', context)


@login_required
def dashboard(request):
    """Dashboard view - different for students and teachers."""
    user = request.user

    if user.is_teacher:
        # Teacher dashboard
        my_fiches = Fiche.objects.filter(author=user).annotate(
            question_count=Count('questions'),
            attempt_count=Count('attempts')
        ).order_by('-created_at')[:10]

        # Recent quiz attempts on teacher's fiches
        recent_attempts = QuizAttempt.objects.filter(
            fiche__author=user
        ).select_related('student', 'fiche').order_by('-completed_at')[:10]

        context = {
            'my_fiches': my_fiches,
            'recent_attempts': recent_attempts,
            'total_fiches': my_fiches.count(),
        }
        return render(request, 'dashboard_teacher.html', context)
    else:
        # Student dashboard
        recent_fiches = Fiche.objects.filter(is_published=True).order_by('-created_at')[:10]

        # Student's recent quiz attempts
        my_attempts = QuizAttempt.objects.filter(
            student=user
        ).select_related('fiche').order_by('-completed_at')[:10]

        # Statistics
        total_attempts = my_attempts.count()
        if total_attempts > 0:
            average_score = sum(a.score for a in my_attempts) / total_attempts
        else:
            average_score = 0

        context = {
            'recent_fiches': recent_fiches,
            'my_attempts': my_attempts,
            'total_attempts': total_attempts,
            'average_score': average_score,
        }
        return render(request, 'dashboard_student.html', context)
