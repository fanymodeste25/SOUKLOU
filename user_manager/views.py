from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta

from accounts.models import User
from fiches.models import Fiche
from quizzes.models import Question, Answer
from results.models import QuizAttempt


def is_teacher(user):
    """Vérifie si l'utilisateur est un enseignant"""
    return user.is_authenticated and user.is_teacher


@login_required
@user_passes_test(is_teacher)
def user_list(request):
    """Liste tous les utilisateurs avec filtres"""
    # Récupérer les paramètres de filtrage
    role_filter = request.GET.get('role', 'all')
    search_query = request.GET.get('search', '')

    # Requête de base
    users = User.objects.all().order_by('-created_at')

    # Appliquer les filtres
    if role_filter == 'student':
        users = users.filter(role='student')
    elif role_filter == 'teacher':
        users = users.filter(role='teacher')

    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )

    # Statistiques
    total_users = User.objects.count()
    total_students = User.objects.filter(role='student').count()
    total_teachers = User.objects.filter(role='teacher').count()

    context = {
        'users': users,
        'role_filter': role_filter,
        'search_query': search_query,
        'total_users': total_users,
        'total_students': total_students,
        'total_teachers': total_teachers,
    }

    return render(request, 'user_manager/user_list.html', context)


@login_required
@user_passes_test(is_teacher)
def user_detail(request, user_id):
    """Affiche les détails d'un utilisateur"""
    user_obj = get_object_or_404(User, pk=user_id)

    context = {
        'user_obj': user_obj,
    }

    # Statistiques spécifiques selon le rôle
    if user_obj.is_student:
        # Statistiques pour un étudiant
        attempts = QuizAttempt.objects.filter(student=user_obj)
        context.update({
            'total_attempts': attempts.count(),
            'avg_score': attempts.aggregate(Avg('score'))['score__avg'] or 0,
            'recent_attempts': attempts[:5],
            'passed_count': attempts.filter(score__gte=50).count(),
        })
    elif user_obj.is_teacher:
        # Statistiques pour un enseignant
        fiches = Fiche.objects.filter(author=user_obj)
        context.update({
            'total_fiches': fiches.count(),
            'published_fiches': fiches.filter(is_published=True).count(),
            'unpublished_fiches': fiches.filter(is_published=False).count(),
            'total_views': fiches.aggregate(total=Count('views_count'))['total'] or 0,
            'recent_fiches': fiches[:5],
        })

    return render(request, 'user_manager/user_detail.html', context)


@login_required
@user_passes_test(is_teacher)
def pending_work_dashboard(request):
    """Dashboard des travaux en attente"""

    # 1. Fiches non publiées
    unpublished_fiches = Fiche.objects.filter(
        is_published=False
    ).select_related('author').order_by('-created_at')

    # 2. Questions sans réponse correcte
    questions_without_correct_answer = Question.objects.annotate(
        correct_answers_count=Count('answers', filter=Q(answers__is_correct=True))
    ).filter(correct_answers_count=0).select_related('fiche', 'fiche__author')

    # 3. Questions avec moins de 2 réponses
    questions_insufficient_answers = Question.objects.annotate(
        answers_count=Count('answers')
    ).filter(answers_count__lt=2).select_related('fiche', 'fiche__author')

    # 4. Tentatives récentes (dernières 24h)
    recent_cutoff = timezone.now() - timedelta(hours=24)
    recent_attempts = QuizAttempt.objects.filter(
        completed_at__gte=recent_cutoff
    ).select_related('student', 'fiche').order_by('-completed_at')

    # 5. Fiches sans questions
    fiches_without_questions = Fiche.objects.annotate(
        question_count=Count('questions')
    ).filter(question_count=0, is_published=True).select_related('author')

    # 6. Nouveaux utilisateurs (derniers 7 jours)
    week_ago = timezone.now() - timedelta(days=7)
    new_users = User.objects.filter(created_at__gte=week_ago).order_by('-created_at')

    context = {
        'unpublished_fiches': unpublished_fiches,
        'unpublished_fiches_count': unpublished_fiches.count(),

        'questions_without_correct_answer': questions_without_correct_answer,
        'questions_without_correct_answer_count': questions_without_correct_answer.count(),

        'questions_insufficient_answers': questions_insufficient_answers,
        'questions_insufficient_answers_count': questions_insufficient_answers.count(),

        'recent_attempts': recent_attempts,
        'recent_attempts_count': recent_attempts.count(),

        'fiches_without_questions': fiches_without_questions,
        'fiches_without_questions_count': fiches_without_questions.count(),

        'new_users': new_users,
        'new_users_count': new_users.count(),
    }

    return render(request, 'user_manager/pending_work_dashboard.html', context)


@login_required
@user_passes_test(is_teacher)
def statistics_overview(request):
    """Vue d'ensemble des statistiques de la plateforme"""

    # Statistiques globales
    total_users = User.objects.count()
    total_students = User.objects.filter(role='student').count()
    total_teachers = User.objects.filter(role='teacher').count()

    total_fiches = Fiche.objects.count()
    published_fiches = Fiche.objects.filter(is_published=True).count()
    total_questions = Question.objects.count()
    total_attempts = QuizAttempt.objects.count()

    # Statistiques de performance
    avg_score = QuizAttempt.objects.aggregate(Avg('score'))['score__avg'] or 0
    passed_attempts = QuizAttempt.objects.filter(score__gte=50).count()
    pass_rate = (passed_attempts / total_attempts * 100) if total_attempts > 0 else 0

    # Top 5 fiches les plus populaires
    top_fiches = Fiche.objects.filter(is_published=True).order_by('-views_count')[:5]

    # Top 5 étudiants
    top_students = User.objects.filter(role='student').annotate(
        avg_score=Avg('quizattempt__score'),
        attempt_count=Count('quizattempt')
    ).filter(attempt_count__gt=0).order_by('-avg_score')[:5]

    # Enseignants les plus actifs
    active_teachers = User.objects.filter(role='teacher').annotate(
        fiche_count=Count('authored_fiches')
    ).filter(fiche_count__gt=0).order_by('-fiche_count')[:5]

    context = {
        'total_users': total_users,
        'total_students': total_students,
        'total_teachers': total_teachers,
        'total_fiches': total_fiches,
        'published_fiches': published_fiches,
        'total_questions': total_questions,
        'total_attempts': total_attempts,
        'avg_score': avg_score,
        'pass_rate': pass_rate,
        'top_fiches': top_fiches,
        'top_students': top_students,
        'active_teachers': active_teachers,
    }

    return render(request, 'user_manager/statistics_overview.html', context)
