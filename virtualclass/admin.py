from django.contrib import admin
from .models import Classroom, ClassSession, Attendance, SharedFile

admin.site.register(Classroom)
admin.site.register(ClassSession)
admin.site.register(Attendance)
admin.site.register(SharedFile)