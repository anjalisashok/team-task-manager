from django.urls import path
from .views import (ProjectListCreateView, ProjectDetailView,
                    TaskListCreateView, TaskDetailView,
                    DashboardView, UserListView)

urlpatterns = [
    path('projects/', ProjectListCreateView.as_view()),
    path('projects/<int:pk>/', ProjectDetailView.as_view()),
    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),
    path('tasks/dashboard/', DashboardView.as_view()),
    path('users/', UserListView.as_view()),
]