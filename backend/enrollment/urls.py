from django.urls import path
from .views import EnrollView, MyEnrollmentsView

urlpatterns = [
    path('my-courses/', MyEnrollmentsView.as_view(), name='my-enrollments'),
]