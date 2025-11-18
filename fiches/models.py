from django.db import models
from django.conf import settings
from django.urls import reverse


class Fiche(models.Model):
    """Model representing a summary sheet (fiche de cours)."""

    title = models.CharField(
        max_length=200,
        verbose_name='Titre'
    )
    description = models.TextField(
        verbose_name='Description',
        help_text='Une brève description de la fiche'
    )
    content = models.TextField(
        verbose_name='Contenu',
        help_text='Le résumé complet du cours'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='fiches',
        verbose_name='Auteur'
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Catégorie',
        help_text='Ex: Mathématiques, Physique, Histoire...'
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Débutant'),
            ('intermediate', 'Intermédiaire'),
            ('advanced', 'Avancé'),
        ],
        default='intermediate',
        verbose_name='Niveau de difficulté'
    )
    is_published = models.BooleanField(
        default=True,
        verbose_name='Publié'
    )
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Nombre de vues'
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
        verbose_name = 'Fiche'
        verbose_name_plural = 'Fiches'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('fiches:detail', kwargs={'pk': self.pk})

    def increment_views(self):
        """Increment the view count."""
        self.views_count += 1
        self.save(update_fields=['views_count'])
