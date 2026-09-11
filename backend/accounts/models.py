from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        TEACHER = 'TEACHER', 'Teacher'
        STUDENT = 'STUDENT', 'Student'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
    )
    bio = models.TextField(blank=True)
    subject_or_expertise = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"