from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer

class SubmitReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id, customer=request.user)
        
        if booking.status != 'completed':
            return Response({'error': 'Booking not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        if hasattr(booking, 'review'):
            return Response({'error': 'Review already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            customer=request.user,
            booking=booking
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MyReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(customer=self.request.user).order_by('-created_at')