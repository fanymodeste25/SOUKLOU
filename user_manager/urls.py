from django.urls import path
from . import views

app_name = 'user_manager'

urlpatterns = [
    # Gestion des utilisateurs
    path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),

    # Dashboard des travaux en attente
    path('pending-work/', views.pending_work_dashboard, name='pending_work_dashboard'),

    # Statistiques
    path('statistics/', views.statistics_overview, name='statistics_overview'),
]
