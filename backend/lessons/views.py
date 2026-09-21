from rest_framework import generics, permissions
from .models import Lesson
from .serializers import LessonSerializer
from .permissions import IsEnrolledOrTeacherOwner


class LessonListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrTeacherOwner]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_id'])

    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['course_id'])


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsEnrolledOrTeacherOwner]
    queryset = Lesson.objects.all()