from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'title', 'instructions', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['course']