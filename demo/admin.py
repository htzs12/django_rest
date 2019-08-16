from django.contrib import admin
from .models import VueApi


class VueAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'name', 'add_time')


admin.site.register(VueApi, VueAdmin)
