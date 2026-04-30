from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    
    
    
    
    
    
    
    service_price = serializers.DecimalField(source='service.price', read_only=True, max_digits=10, decimal_places=2)
    
    
    
    
    
    
    
    
    
    
    
    
    service_title = serializers.CharField(source='service.title', read_only=True)
    provider_name = serializers.CharField(source='service.provider.username', read_only=True)
    provider_id = serializers.CharField(source='service.provider.id', read_only=True)
    
    class Meta:
        model = Booking
        fields = ('id', 'customer', 'customer_name', 'service', 'service_title', 
                  'provider_name', 'provider_id', 'status', 'booking_date', 
                  'scheduled_date', 'notes', 'created_at', 'updated_at', 'service_price')
        read_only_fields = ('id', 'created_at', 'updated_at', 'booking_date')
        extra_kwargs = {
            'customer': {'write_only': True}
        }