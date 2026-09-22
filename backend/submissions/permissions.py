from rest_framework import permissions
from enrollment.models import Enrollment


class IsStudentEnrolled(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.role != 'STUDENT':
            return False
        assignment = view.get_assignment()
        return Enrollment.objects.filter(course=assignment.course, student=request.user).exists()


class IsCourseTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assignment.course.teacher == request.user