from rest_framework import generics, permissions
from .models import Assignment
from .serializers import AssignmentSerializer
from .permissions import IsEnrolledOrTeacherOwnerAssignment


class AssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrTeacherOwnerAssignment]

    def get_queryset(self):
        return Assignment.objects.filter(course_id=self.kwargs['course_id'])

    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['course_id'])


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Assignment.objects.all()