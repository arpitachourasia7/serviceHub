# from rest_framework import serializers
# from .models import Review

# class ReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Review
#         fields = ['id', 'rating', 'comment', 'created_at']





# from rest_framework import serializers
# from .models import Review

# class ReviewSerializer(serializers.ModelSerializer):
#     customer_name = serializers.CharField(source='customer.username', read_only=True)
#     service_title = serializers.CharField(source='booking.service.title', read_only=True)
    
#     class Meta:
#         model = Review
#         fields = ['id', 'customer', 'customer_name', 'booking', 'service_title', 'rating', 'comment', 'created_at']
#         read_only_fields = ['id', 'created_at', 'customer']








# from rest_framework import serializers
# from .models import Review

# class ReviewSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(source='customer.username', read_only=True)
#     service_title = serializers.CharField(source='booking.service.title', read_only=True)
#     provider_name = serializers.CharField(source='booking.service.provider.username', read_only=True)
    
#     class Meta:
#         model = Review
#         fields = ['id', 'customer', 'customer_name', 'booking', 'service_title', 
#                   'provider_name', 'rating', 'comment', 'created_at']
#         read_only_fields = ['id', 'created_at']






from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='customer.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'customer', 'username', 'booking', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']