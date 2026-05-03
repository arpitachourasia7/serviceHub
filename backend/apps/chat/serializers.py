from rest_framework import serializers
from .models import Conversation, Message
from apps.users.models import User

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)
    
    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'sender_role', 
                  'content', 'is_read', 'read_at', 'created_at')
        read_only_fields = ('id', 'created_at', 'sender_name', 'sender_role')
        extra_kwargs = {
            'sender': {'write_only': True},
            'conversation': {'write_only': True}
        }

class ConversationSerializer(serializers.ModelSerializer):
 
    customer_detail = SimpleUserSerializer(source='customer', read_only=True)
    provider_detail = SimpleUserSerializer(source='provider', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ('id', 'customer', 'customer_detail', 'provider', 'provider_detail',
                  'service', 'booking', 'last_message', 'unread_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_last_message(self, obj):

        last_msg = obj.messages.order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user

            return obj.messages.filter(is_read=False).exclude(sender=user).count()
        return 0