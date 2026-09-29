from django.urls import path
from .views import CourseListCreateView, CourseDetailView, MyCoursesView

urlpatterns = [
    path('', CourseListCreateView.as_view(), name='course-list'),
    path('mine/', MyCoursesView.as_view(), name='my-courses-teacher'),
    path('<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
]