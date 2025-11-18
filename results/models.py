from django.db import models
from django.conf import settings
from fiches.models import Fiche
from quizzes.models import Question, Answer


class QuizAttempt(models.Model):
    """Model representing a student's attempt at a quiz."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts',
        verbose_name='Élève'
    )
    fiche = models.ForeignKey(
        Fiche,
        on_delete=models.CASCADE,
        related_name='attempts',
        verbose_name='Fiche'
    )
    score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        verbose_name='Score (%)'
    )
    total_questions = models.PositiveIntegerField(
        verbose_name='Nombre total de questions'
    )
    correct_answers = models.PositiveIntegerField(
        verbose_name='Réponses correctes'
    )
    time_spent = models.DurationField(
        null=True,
        blank=True,
        verbose_name='Temps passé'
    )
    completed_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de completion'
    )

    class Meta:
        verbose_name = 'Tentative de quiz'
        verbose_name_plural = 'Tentatives de quiz'
        ordering = ['-completed_at']
        indexes = [
            models.Index(fields=['student', '-completed_at']),
            models.Index(fields=['fiche', '-score']),
        ]

    def __str__(self):
        return f"{self.student.username} - {self.fiche.title} - {self.score}%"

    @property
    def passed(self):
        """Check if the student passed (score >= 50%)."""
        return self.score >= 50


class QuestionAnswer(models.Model):
    """Model representing a student's answer to a specific question."""

    attempt = models.ForeignKey(
        QuizAttempt,
        on_delete=models.CASCADE,
        related_name='question_answers',
        verbose_name='Tentative'
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        verbose_name='Question'
    )
    selected_answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        verbose_name='Réponse sélectionnée'
    )
    is_correct = models.BooleanField(
        verbose_name='Correcte'
    )
    answered_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de réponse'
    )

    class Meta:
        verbose_name = 'Réponse à une question'
        verbose_name_plural = 'Réponses aux questions'
        unique_together = ['attempt', 'question']

    def __str__(self):
        status = "✓" if self.is_correct else "✗"
        return f"{status} {self.question.text[:30]}..."
