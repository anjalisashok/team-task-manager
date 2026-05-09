from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from accounts.models import User
from accounts.serializers import UserSerializer
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer
from .permissions import IsAdminOrOwner

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all().order_by('-created_at')
        return Project.objects.filter(
            Q(owner=user) | Q(members=user)
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProjectDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        return Project.objects.all()

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.request.query_params.get('projectId')
        if project_id:
            return Task.objects.filter(project_id=project_id).order_by('-created_at')
        return Task.objects.filter(assigned_to=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

class DashboardView(APIView):
    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(assigned_to=user)
        total = tasks.count()
        by_status = {}
        for t in tasks:
            by_status[t.status] = by_status.get(t.status, 0) + 1
        overdue = tasks.filter(
            due_date__lt=timezone.now().date()
        ).exclude(status='done').select_related('project')
        overdue_data = TaskSerializer(overdue, many=True).data
        return Response({
            'total': total,
            'byStatus': [{'status': k, 'count': v} for k, v in by_status.items()],
            'overdue': overdue_data
        })

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

# Create your views here.
