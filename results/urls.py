from django.urls import path
from . import views

app_name = 'results'

urlpatterns = [
    path('attempt/<int:pk>/', views.attempt_detail, name='attempt_detail'),
    path('my-results/', views.my_results, name='my_results'),
    path('fiche/<int:fiche_pk>/', views.fiche_results, name='fiche_results'),
]
