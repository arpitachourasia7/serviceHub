from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from apps.services.models import Service


class BookingListView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        print(f"User: {user.username}, Is provider: {hasattr(user, 'is_provider')}")
        
        if hasattr(user, 'is_customer') and user.is_customer:
            return Booking.objects.filter(customer=user)
        
        if hasattr(user, 'is_provider') and user.is_provider:
            provider_service_ids = Service.objects.filter(provider=user).values_list('id', flat=True)
            print(f"Provider {user.username} owns services: {list(provider_service_ids)}")
            
            bookings = Booking.objects.filter(service__id__in=provider_service_ids)
            print(f"Found {bookings.count()} bookings for this provider")
            return bookings
        
        return Booking.objects.none()
    
    def create(self, request, *args, **kwargs):
        service_id = request.data.get('service')
        notes = request.data.get('notes', '')
        
        if not service_id:
            return Response(
                {"error": "Please select a service"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        booking = Booking.objects.create(
            customer=request.user,
            service=service,
            status='pending',
            notes=notes
        )
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'is_customer') and user.is_customer:
            return Booking.objects.filter(customer=user)
        
        if hasattr(user, 'is_provider') and user.is_provider:
            provider_service_ids = Service.objects.filter(provider=user).values_list('id', flat=True)
            return Booking.objects.filter(service__id__in=provider_service_ids)
        
        return Booking.objects.none()
    
    def patch(self, request, *args, **kwargs):
        booking = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {"error": "Status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        
        if hasattr(user, 'is_provider') and user.is_provider:
            if booking.service.provider == user:
                if new_status in ['accepted', 'rejected', 'completed']:
                    booking.status = new_status
                    booking.save()
                    serializer = self.get_serializer(booking)
                    return Response(serializer.data)
                return Response(
                    {"error": "Providers can only accept, reject, or complete bookings"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if hasattr(user, 'is_customer') and user.is_customer and booking.customer == user:
            if new_status == 'cancelled':
                booking.status = new_status
                booking.save()
                serializer = self.get_serializer(booking)
                return Response(serializer.data)
            return Response(
                {"error": "Customers can only cancel bookings"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {"error": "You don't have permission to change this booking"},
            status=status.HTTP_403_FORBIDDEN
        )