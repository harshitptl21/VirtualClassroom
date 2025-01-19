from django.apps import AppConfig

class VirtualclassConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'virtualclass'

    def ready(self):
        import virtualclass.signals