from django.urls import path
from .views import SubmitAssignmentView, AssignmentSubmissionsView, SubmissionDetailView, GradeSubmissionView

urlpatterns = [
    path('assignments/<int:assignment_id>/submit/', SubmitAssignmentView.as_view(), name='submit'),
    path('assignments/<int:assignment_id>/submissions/', AssignmentSubmissionsView.as_view(), name='assignment-submissions'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
    path('submissions/<int:pk>/grade/', GradeSubmissionView.as_view(), name='grade-submission'),
]