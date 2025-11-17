from django.contrib import admin
from .models import Fiche


@admin.register(Fiche)
class FicheAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'difficulty_level', 'is_published', 'views_count', 'created_at']
    list_filter = ['is_published', 'difficulty_level', 'category', 'created_at']
    search_fields = ['title', 'description', 'content', 'author__username']
    prepopulated_fields = {}
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['views_count', 'created_at', 'updated_at']

    fieldsets = (
        ('Informations générales', {
            'fields': ('title', 'author', 'category', 'difficulty_level')
        }),
        ('Contenu', {
            'fields': ('description', 'content')
        }),
        ('Publication', {
            'fields': ('is_published',)
        }),
        ('Statistiques', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.author = request.user
        super().save_model(request, obj, form, change)
