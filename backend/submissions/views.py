from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from assignments.models import Assignment
from .models import Submission
from .serializers import SubmissionSerializer, GradeSerializer
from .permissions import IsStudentEnrolled, IsCourseTeacher


class SubmitAssignmentView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentEnrolled]

    def get_assignment(self):
        return get_object_or_404(Assignment, pk=self.kwargs['assignment_id'])

    def create(self, request, *args, **kwargs):
        assignment = self.get_assignment()
        existing = Submission.objects.filter(assignment=assignment, student=request.user).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save(assignment=assignment, student=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssignmentSubmissionsView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        assignment = get_object_or_404(Assignment, pk=self.kwargs['assignment_id'])
        if assignment.course.teacher != self.request.user:
            return Submission.objects.none()
        return Submission.objects.filter(assignment=assignment)


class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Submission.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if obj.student != user and obj.assignment.course.teacher != user:
            self.permission_denied(self.request)
        return obj


class GradeSubmissionView(generics.UpdateAPIView):
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated, IsCourseTeacher]
    queryset = Submission.objects.all()