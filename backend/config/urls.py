from django.contrib import admin
from django.urls import path, include
from enrollment.views import EnrollView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/courses/<int:course_id>/lessons/', include('lessons.urls')),
    path('api/courses/<int:course_id>/enroll/', EnrollView.as_view(), name='enroll'),
    path('api/', include('enrollment.urls')),
]