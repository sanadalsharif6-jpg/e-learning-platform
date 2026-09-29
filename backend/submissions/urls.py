from django.urls import path
from .views import SubmitAssignmentView, AssignmentSubmissionsView, SubmissionDetailView, GradeSubmissionView, PendingGradingView

urlpatterns = [
    path('assignments/<int:assignment_id>/submit/', SubmitAssignmentView.as_view(), name='submit'),
    path('assignments/<int:assignment_id>/submissions/', AssignmentSubmissionsView.as_view(), name='assignment-submissions'),
    path('submissions/pending-grading/', PendingGradingView.as_view(), name='pending-grading'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),
    path('submissions/<int:pk>/grade/', GradeSubmissionView.as_view(), name='grade-submission'),
]