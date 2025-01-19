from django.db import models
from django.contrib.auth.models import User

class Classroom(models.Model):
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teaching_classes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ClassSession(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.classroom.name} - {self.start_time}"

class Attendance(models.Model):
    session = models.ForeignKey(ClassSession, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    join_time = models.DateTimeField(auto_now_add=True)
    leave_time = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('session', 'student')

class SharedFile(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='classroom_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.file.name} - {self.classroom.name}"