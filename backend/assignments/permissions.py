from rest_framework import permissions
from courses.models import Course
from enrollment.models import Enrollment


class IsEnrolledOrTeacherOwnerAssignment(permissions.BasePermission):
    def has_permission(self, request, view):
        course_id = view.kwargs.get('course_id')
        if not course_id:
            return True
        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return False

        if request.method == 'POST':
            return request.user.is_authenticated and course.teacher == request.user

        if not request.user.is_authenticated:
            return False

        if course.teacher == request.user:
            return True

        return Enrollment.objects.filter(course=course, student=request.user).exists()

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if obj.course.teacher == request.user:
                return True
            return Enrollment.objects.filter(course=obj.course, student=request.user).exists()
        return obj.course.teacher == request.user