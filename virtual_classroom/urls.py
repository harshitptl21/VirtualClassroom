from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from virtualclass import auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('virtualclass/', include('virtualclass.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)