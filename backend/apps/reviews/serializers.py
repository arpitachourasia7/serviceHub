from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'customer', 'username', 'booking', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']