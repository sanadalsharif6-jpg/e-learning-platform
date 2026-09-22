from django.db import models
from django.conf import settings
from django.utils import timezone
from assignments.models import Assignment


class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    content = models.TextField(blank=True)
    file_url = models.URLField(blank=True)
    submitted_at = models.DateTimeField(auto_now=True)
    grade = models.PositiveIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)

    class Meta:
        unique_together = ('assignment', 'student')

    @property
    def is_late(self):
        return self.submitted_at > self.assignment.due_date

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"