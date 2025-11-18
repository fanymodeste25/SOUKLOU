from django.contrib import admin
from .models import QuizAttempt, QuestionAnswer


class QuestionAnswerInline(admin.TabularInline):
    model = QuestionAnswer
    extra = 0
    readonly_fields = ['question', 'selected_answer', 'is_correct', 'answered_at']
    can_delete = False


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'fiche', 'score', 'correct_answers', 'total_questions', 'passed', 'completed_at']
    list_filter = ['completed_at', 'fiche', 'student']
    search_fields = ['student__username', 'student__email', 'fiche__title']
    ordering = ['-completed_at']
    readonly_fields = ['student', 'fiche', 'score', 'total_questions', 'correct_answers', 'time_spent', 'completed_at']
    inlines = [QuestionAnswerInline]

    def passed(self, obj):
        return obj.passed
    passed.boolean = True
    passed.short_description = 'Réussi'


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt_short', 'question_short', 'selected_answer_short', 'is_correct', 'answered_at']
    list_filter = ['is_correct', 'answered_at']
    search_fields = ['attempt__student__username', 'question__text']
    ordering = ['-answered_at']
    readonly_fields = ['attempt', 'question', 'selected_answer', 'is_correct', 'answered_at']

    def attempt_short(self, obj):
        return f"{obj.attempt.student.username} - {obj.attempt.fiche.title}"
    attempt_short.short_description = 'Tentative'

    def question_short(self, obj):
        return obj.question.text[:50] + '...' if len(obj.question.text) > 50 else obj.question.text
    question_short.short_description = 'Question'

    def selected_answer_short(self, obj):
        return obj.selected_answer.text[:50] + '...' if len(obj.selected_answer.text) > 50 else obj.selected_answer.text
    selected_answer_short.short_description = 'Réponse'
