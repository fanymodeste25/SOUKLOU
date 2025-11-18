from django.contrib import admin
from .models import Question, Answer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    fields = ['text', 'is_correct', 'order']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text_short', 'fiche', 'order', 'points', 'created_at']
    list_filter = ['fiche', 'created_at']
    search_fields = ['text', 'fiche__title']
    ordering = ['fiche', 'order']
    inlines = [AnswerInline]

    fieldsets = (
        ('Question', {
            'fields': ('fiche', 'text', 'order', 'points')
        }),
    )

    def text_short(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_short.short_description = 'Question'


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['text_short', 'question_short', 'is_correct', 'order']
    list_filter = ['is_correct', 'created_at']
    search_fields = ['text', 'question__text']
    ordering = ['question', 'order']

    def text_short(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_short.short_description = 'Réponse'

    def question_short(self, obj):
        return obj.question.text[:50] + '...' if len(obj.question.text) > 50 else obj.question.text
    question_short.short_description = 'Question'
