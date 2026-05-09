from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Project, Task

class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source='assigned_to.first_name', read_only=True, default='Unassigned')
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority',
                  'due_date', 'project', 'assigned_to', 'assignee_name',
                  'project_name', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner_id', 'members',
                  'member_ids', 'task_count', 'created_at']
        read_only_fields = ['created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()

    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])
        project = Project.objects.create(**validated_data)
        if member_ids:
            project.members.set(member_ids)
        return project