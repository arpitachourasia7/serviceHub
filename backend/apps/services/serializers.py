from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_id = serializers.CharField(source='provider.id', read_only=True)

    class Meta:
        model = Service
        fields = (
            'id', 'provider', 'provider_name', 'provider_id',
            'title', 'description', 'price', 'category',
            'image', 'is_active', 'created_at', 'updated_at'
        )

        read_only_fields = (
            'id', 'provider',
            'created_at', 'updated_at',
            'provider_name', 'provider_id'
        )