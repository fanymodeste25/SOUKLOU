from django.db import models
from fiches.models import Fiche


class Question(models.Model):
    """Model representing a quiz question for a fiche."""

    fiche = models.ForeignKey(
        Fiche,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name='Fiche'
    )
    text = models.TextField(
        verbose_name='Question',
        help_text='Le texte de la question'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre',
        help_text="Ordre d'affichage de la question"
    )
    points = models.PositiveIntegerField(
        default=1,
        verbose_name='Points',
        help_text='Nombre de points pour cette question'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de création'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Date de modification'
    )

    class Meta:
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}..."

    def get_correct_answer(self):
        """Return the correct answer for this question."""
        return self.answers.filter(is_correct=True).first()


class Answer(models.Model):
    """Model representing a possible answer to a question."""

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name='Question'
    )
    text = models.CharField(
        max_length=500,
        verbose_name='Réponse'
    )
    is_correct = models.BooleanField(
        default=False,
        verbose_name='Réponse correcte'
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre',
        help_text="Ordre d'affichage de la réponse"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de création'
    )

    class Meta:
        verbose_name = 'Réponse'
        verbose_name_plural = 'Réponses'
        ordering = ['order', 'created_at']

    def __str__(self):
        status = "✓" if self.is_correct else "✗"
        return f"{status} {self.text[:50]}"
