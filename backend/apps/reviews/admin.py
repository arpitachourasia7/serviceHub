from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'rating', 'comment_preview', 'created_at']  # Removed 'service'
    list_filter = ['rating', 'created_at']
    search_fields = ['customer__email', 'customer__username', 'comment']
    readonly_fields = ['id', 'created_at']
    
    def comment_preview(self, obj):
        return obj.comment[:50] if obj.comment else '-'
    comment_preview.short_description = 'Comment'