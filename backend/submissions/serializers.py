from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    is_late = serializers.ReadOnlyField()
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'student', 'student_username', 'content', 'file_url',
                  'submitted_at', 'is_late', 'grade', 'feedback']
        read_only_fields = ['assignment', 'student', 'grade', 'feedback']


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['grade', 'feedback']

    def validate_grade(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Grade must be between 0 and 100.")
        return value