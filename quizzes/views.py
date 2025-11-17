from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from fiches.models import Fiche
from .models import Question, Answer
from .forms import QuestionForm, AnswerFormSet
from results.models import QuizAttempt, QuestionAnswer


@login_required
def take_quiz(request, fiche_pk):
    """View for students to take a quiz."""
    fiche = get_object_or_404(Fiche, pk=fiche_pk, is_published=True)
    questions = fiche.questions.all().prefetch_related('answers').order_by('order')

    if not questions.exists():
        messages.warning(request, 'Cette fiche ne contient pas encore de quiz.')
        return redirect('fiches:detail', pk=fiche_pk)

    if request.method == 'POST':
        # Process quiz submission
        total_questions = questions.count()
        correct_answers = 0
        start_time = request.session.get('quiz_start_time')

        # Create quiz attempt
        attempt = QuizAttempt.objects.create(
            student=request.user,
            fiche=fiche,
            score=0,  # Will be updated
            total_questions=total_questions,
            correct_answers=0,  # Will be updated
        )

        # Calculate time spent if available
        if start_time:
            time_spent = timezone.now() - timezone.datetime.fromisoformat(start_time)
            attempt.time_spent = time_spent

        # Process each answer
        for question in questions:
            answer_id = request.POST.get(f'question_{question.id}')
            if answer_id:
                try:
                    selected_answer = Answer.objects.get(id=answer_id, question=question)
                    is_correct = selected_answer.is_correct

                    if is_correct:
                        correct_answers += 1

                    # Save the answer
                    QuestionAnswer.objects.create(
                        attempt=attempt,
                        question=question,
                        selected_answer=selected_answer,
                        is_correct=is_correct
                    )
                except Answer.DoesNotExist:
                    pass

        # Update attempt with results
        attempt.correct_answers = correct_answers
        attempt.score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
        attempt.save()

        # Clear session
        if 'quiz_start_time' in request.session:
            del request.session['quiz_start_time']

        messages.success(request, f'Quiz terminé ! Votre score : {attempt.score:.1f}%')
        return redirect('results:attempt_detail', pk=attempt.pk)

    # Store start time in session
    if 'quiz_start_time' not in request.session:
        request.session['quiz_start_time'] = timezone.now().isoformat()

    context = {
        'fiche': fiche,
        'questions': questions,
    }
    return render(request, 'quizzes/take_quiz.html', context)


@login_required
def question_create(request, fiche_pk):
    """View for teachers to create a question with answers."""
    fiche = get_object_or_404(Fiche, pk=fiche_pk)

    if fiche.author != request.user and not request.user.is_superuser:
        messages.error(request, 'Vous ne pouvez ajouter des questions qu\'à vos propres fiches.')
        return redirect('fiches:detail', pk=fiche_pk)

    if request.method == 'POST':
        form = QuestionForm(request.POST)
        formset = AnswerFormSet(request.POST)

        if form.is_valid() and formset.is_valid():
            question = form.save(commit=False)
            question.fiche = fiche
            question.save()

            # Save answers
            answers = formset.save(commit=False)
            for answer in answers:
                answer.question = question
                answer.save()

            # Check if at least one correct answer exists
            if not question.answers.filter(is_correct=True).exists():
                messages.warning(request, 'Attention : aucune réponse correcte n\'a été définie.')

            messages.success(request, 'Question ajoutée avec succès !')
            return redirect('fiches:detail', pk=fiche_pk)
    else:
        form = QuestionForm(initial={'fiche': fiche})
        formset = AnswerFormSet()

    context = {
        'form': form,
        'formset': formset,
        'fiche': fiche,
        'action': 'Créer',
    }
    return render(request, 'quizzes/question_form.html', context)


@login_required
def question_update(request, pk):
    """View for teachers to update a question."""
    question = get_object_or_404(Question, pk=pk)
    fiche = question.fiche

    if fiche.author != request.user and not request.user.is_superuser:
        messages.error(request, 'Vous ne pouvez modifier que les questions de vos propres fiches.')
        return redirect('fiches:detail', pk=fiche.pk)

    if request.method == 'POST':
        form = QuestionForm(request.POST, instance=question)
        formset = AnswerFormSet(request.POST, instance=question)

        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()

            # Check if at least one correct answer exists
            if not question.answers.filter(is_correct=True).exists():
                messages.warning(request, 'Attention : aucune réponse correcte n\'a été définie.')

            messages.success(request, 'Question mise à jour avec succès !')
            return redirect('fiches:detail', pk=fiche.pk)
    else:
        form = QuestionForm(instance=question)
        formset = AnswerFormSet(instance=question)

    context = {
        'form': form,
        'formset': formset,
        'fiche': fiche,
        'question': question,
        'action': 'Modifier',
    }
    return render(request, 'quizzes/question_form.html', context)


@login_required
def question_delete(request, pk):
    """View for teachers to delete a question."""
    question = get_object_or_404(Question, pk=pk)
    fiche = question.fiche

    if fiche.author != request.user and not request.user.is_superuser:
        messages.error(request, 'Vous ne pouvez supprimer que les questions de vos propres fiches.')
        return redirect('fiches:detail', pk=fiche.pk)

    if request.method == 'POST':
        question.delete()
        messages.success(request, 'Question supprimée avec succès !')
        return redirect('fiches:detail', pk=fiche.pk)

    context = {
        'question': question,
        'fiche': fiche,
    }
    return render(request, 'quizzes/question_confirm_delete.html', context)
