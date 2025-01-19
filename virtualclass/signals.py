from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import ClassSession, Attendance

@receiver(post_save, sender=ClassSession)
def handle_session_end(sender, instance, created, **kwargs):
    """
    When a class session ends (end_time is set), automatically update all
    unclosed attendance records for that session
    """
    if not created and instance.end_time:
        # Update all attendance records that don't have a leave time
        Attendance.objects.filter(
            session=instance,
            leave_time__isnull=True
        ).update(leave_time=instance.end_time)

@receiver(pre_save, sender=Attendance)
def validate_attendance(sender, instance, **kwargs):
    """
    Ensure attendance records are valid:
    - Join time must be during the session
    - Leave time must be after join time
    """
    if instance.leave_time and instance.leave_time < instance.join_time:
        raise ValueError("Leave time cannot be before join time")

    session = instance.session
    if session.end_time and instance.join_time > session.end_time:
        raise ValueError("Cannot join after session has ended")