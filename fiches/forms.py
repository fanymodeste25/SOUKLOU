from django import forms
from .models import Fiche


class FicheForm(forms.ModelForm):
    """Form for creating and editing fiches."""

    class Meta:
        model = Fiche
        fields = ['title', 'description', 'content', 'category', 'difficulty_level', 'is_published']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'placeholder': 'Titre de la fiche'
            }),
            'description': forms.Textarea(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'rows': 3,
                'placeholder': 'Une brève description...'
            }),
            'content': forms.Textarea(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'rows': 10,
                'placeholder': 'Contenu du résumé...'
            }),
            'category': forms.TextInput(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'placeholder': 'Ex: Mathématiques, Physique...'
            }),
            'difficulty_level': forms.Select(attrs={
                'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }),
            'is_published': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
            }),
        }
