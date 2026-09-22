from django.urls import path
from .views import AssignmentListCreateView, AssignmentDetailView

urlpatterns = [
    path('', AssignmentListCreateView.as_view(), name='assignment-list'),
]