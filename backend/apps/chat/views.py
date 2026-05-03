from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from apps.users.models import User
from apps.bookings.models import Booking

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_customer:
            return Conversation.objects.filter(customer=user)
        return Conversation.objects.filter(provider=user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class ConversationCreateView(generics.CreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def create(self, request, *args, **kwargs):
        provider_id = request.data.get('provider')
        service_id = request.data.get('service')
        booking_id = request.data.get('booking')
        
        try:
            provider = User.objects.get(id=provider_id)
            customer = request.user if request.user.is_customer else None
            
            if not customer:
                return Response(
                    {"error": "Only customers can initiate conversations"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            conversation, created = Conversation.objects.get_or_create(
                customer=customer,
                provider=provider,
                defaults={
                    'service_id': service_id,
                    'booking_id': booking_id
                }
            )
            
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"error": "Provider not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(conversation_id=conversation_id)

class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def create(self, request, *args, **kwargs):
        conversation_id = request.data.get('conversation')
        content = request.data.get('content')
        
        if not content:
            return Response(
                {"error": "Message content is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            
            if request.user not in [conversation.customer, conversation.provider]:
                return Response(
                    {"error": "You are not part of this conversation"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            message = Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
            
            conversation.save()
            
            serializer = self.get_serializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class MarkMessagesReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            messages = conversation.messages.filter(is_read=False).exclude(sender=request.user)
            count = messages.count()
            messages.update(is_read=True)
            return Response({
                'status': 'success',
                'marked_count': count
            })
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found"},
                status=status.HTTP_404_NOT_FOUND
            )


@api_view(['POST'])
def create_conversation_from_booking(request):
    """Create a conversation from an existing booking"""
    booking_id = request.data.get('booking_id')
    
    try:
        booking = Booking.objects.get(id=booking_id, customer=request.user)
        conversation, created = Conversation.objects.get_or_create(
            customer=booking.customer,
            provider=booking.service.provider,
            service=booking.service,
            booking=booking
        )
        
        return Response({
            'conversation_id': str(conversation.id),
            'created': created,
            'customer': booking.customer.username,
            'provider': booking.service.provider.username
        }, status=status.HTTP_200_OK)
    
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found or you are not the customer'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
