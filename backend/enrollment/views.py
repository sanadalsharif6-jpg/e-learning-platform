from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from courses.models import Course
from .models import Enrollment
from .serializers import EnrollmentSerializer


class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != 'STUDENT':
            return Response({'detail': 'Only students can enroll.'}, status=status.HTTP_403_FORBIDDEN)

        course = get_object_or_404(Course, pk=course_id)

        if Enrollment.objects.filter(course=course, student=request.user).exists():
            return Response({'detail': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)

        enrollment = Enrollment.objects.create(course=course, student=request.user)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)