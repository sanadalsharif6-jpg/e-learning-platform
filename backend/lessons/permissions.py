from rest_framework import permissions
from courses.models import Course


class IsEnrolledOrTeacherOwner(permissions.BasePermission):
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

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.course.teacher == request.user