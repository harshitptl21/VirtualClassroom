from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Classroom, ClassSession, Attendance, SharedFile
import json

@login_required
def classroom_list(request):
    if request.user.is_staff:
        classrooms = Classroom.objects.filter(teacher=request.user)
    else:
        # Assuming you have a many-to-many relationship for students
        classrooms = Classroom.objects.filter(students=request.user)
    
    return JsonResponse({
        'classrooms': [{
            'id': c.id,
            'name': c.name,
            'created_at': c.created_at,
            'teacher': c.teacher.username
        } for c in classrooms]
    })

@csrf_exempt
@login_required
def classroom_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        classroom = Classroom.objects.create(
            name=data['name'],
            teacher=request.user
        )
        return JsonResponse({
            'id': classroom.id,
            'name': classroom.name,
            'created_at': classroom.created_at,
            'teacher': classroom.teacher.username
        })
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def classroom_detail(request, pk):
    classroom = get_object_or_404(Classroom, pk=pk)
    return JsonResponse({
        'id': classroom.id,
        'name': classroom.name,
        'teacher': classroom.teacher.username,
        'created_at': classroom.created_at
    })

@login_required
def join_session(request, pk):
    classroom = get_object_or_404(Classroom, pk=pk)
    session, created = ClassSession.objects.get_or_create(
        classroom=classroom,
        end_time__isnull=True
    )
    attendance = Attendance.objects.create(
        session=session,
        student=request.user
    )
    return JsonResponse({'session_id': session.id})

@login_required
def leave_session(request, pk):
    session = get_object_or_404(ClassSession, pk=pk)
    attendance = get_object_or_404(
        Attendance,
        session=session,
        student=request.user,
        leave_time__isnull=True
    )
    attendance.leave_time = timezone.now()
    attendance.save()
    return JsonResponse({'status': 'success'})

@login_required
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        classroom_id = request.POST.get('classroom_id')
        classroom = get_object_or_404(Classroom, pk=classroom_id)
        file = request.FILES['file']
        shared_file = SharedFile.objects.create(
            classroom=classroom,
            uploaded_by=request.user,
            file=file
        )
        return JsonResponse({
            'id': shared_file.id,
            'name': file.name,
            'url': shared_file.file.url
        })
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def download_file(request, pk):
    shared_file = get_object_or_404(SharedFile, pk=pk)
    return JsonResponse({
        'url': shared_file.file.url
    })
    