from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from virtualclass import auth_views
from . import views

urlpatterns = [
    path('', views.classroom_list, name='classroom_list'),
    path('create/', views.classroom_create, name='classroom_create'),
    path('detail/', views.classroom_detail, name='classroom_detail'), 
    path('join/', views.join_session, name='join_session'),
    path('leave/', views.leave_session, name='leave_session'),
    path('upload/', views.upload_file, name='upload_file'),
    path('files/', views.download_file, name='download_file'),
    path('api/auth/check/', auth_views.check_auth, name='auth_check'),
    path('api/auth/login/', auth_views.login_view, name='auth_login'),
    path('api/auth/logout/', auth_views.logout_view, name='auth_logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
