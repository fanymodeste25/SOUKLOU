from django.urls import path
from . import views

app_name = 'fiches'

urlpatterns = [
    path('', views.fiche_list, name='list'),
    path('<int:pk>/', views.fiche_detail, name='detail'),
    path('create/', views.fiche_create, name='create'),
    path('<int:pk>/update/', views.fiche_update, name='update'),
    path('<int:pk>/delete/', views.fiche_delete, name='delete'),
]
