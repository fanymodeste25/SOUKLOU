from django.urls import path
from . import views

app_name = 'quizzes'

urlpatterns = [
    path('take/<int:fiche_pk>/', views.take_quiz, name='take_quiz'),
    path('question/create/<int:fiche_pk>/', views.question_create, name='question_create'),
    path('question/<int:pk>/update/', views.question_update, name='question_update'),
    path('question/<int:pk>/delete/', views.question_delete, name='question_delete'),
]
