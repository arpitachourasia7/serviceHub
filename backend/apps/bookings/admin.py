from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'service', 'status', 'booking_date')
    list_filter = ('status', 'booking_date')
    search_fields = ('customer__username', 'service__title')