from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Review
from .serializers import ReviewSerializer
from apps.bookings.models import Booking


class MyReviewsView(APIView):
    """Get reviews for the logged-in user (customers see their own reviews)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if hasattr(user, 'is_customer') and user.is_customer:
            reviews = Review.objects.filter(customer=user).order_by('-created_at')
 
        elif hasattr(user, 'is_provider') and user.is_provider:
            reviews = Review.objects.filter(
                booking__service__provider=user
            ).order_by('-created_at')
        else:
            reviews = Review.objects.none()
        
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class SubmitReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)
        
        if booking.customer.id != request.user.id:
            return Response({"error": "Not your booking"}, status=403)
        
        if booking.status != 'completed':
            return Response({"error": "Booking must be completed to review"}, status=400)
        
        if Review.objects.filter(booking=booking).exists():
            return Response({"error": "Review already submitted"}, status=400)
        
        review = Review.objects.create(
            customer=request.user,
            booking=booking,
            rating=request.data.get('rating', 5),
            comment=request.data.get('comment', '')
        )
        
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=201)





