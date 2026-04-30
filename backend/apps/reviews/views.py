# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from .models import Review
# from .serializers import ReviewSerializer
# from apps.bookings.models import Booking

# class SubmitReviewView(generics.CreateAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, booking_id):
#         booking = get_object_or_404(Booking, id=booking_id, customer=request.user)
        
#         if booking.status != 'completed':
#             return Response({'error': 'Booking not completed'}, status=status.HTTP_400_BAD_REQUEST)
        
#         if hasattr(booking, 'review'):
#             return Response({'error': 'Review already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save(
#             customer=request.user,
#             booking=booking
#         )
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

# class MyReviewsView(generics.ListAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Review.objects.filter(customer=self.request.user).order_by('-created_at')







# from rest_framework import generics, permissions, status
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from .models import Review
# from .serializers import ReviewSerializer
# from apps.bookings.models import Booking


# class SubmitReviewView(generics.CreateAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         booking_id = self.kwargs.get('booking_id')
        
#         # Get the booking
#         booking = get_object_or_404(Booking, id=booking_id, customer=request.user)
        
#         # Check if booking is completed
#         if booking.status != 'completed':
#             return Response(
#                 {'error': 'You can only review completed bookings'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Check if review already exists
#         if hasattr(booking, 'review'):
#             return Response(
#                 {'error': 'You have already reviewed this booking'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Create review
#         review = Review.objects.create(
#             customer=request.user,
#             booking=booking,
#             rating=request.data.get('rating'),
#             comment=request.data.get('comment', '')
#         )
        
#         serializer = self.get_serializer(review)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


# class MyReviewsView(generics.ListAPIView):
#     serializer_class = ReviewSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Review.objects.filter(customer=self.request.user).order_by('-created_at')






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
        
        # If user is customer - show their own reviews
        if hasattr(user, 'is_customer') and user.is_customer:
            reviews = Review.objects.filter(customer=user).order_by('-created_at')
        # If user is provider - show reviews for their services
        elif hasattr(user, 'is_provider') and user.is_provider:
            # Get all bookings for services owned by this provider
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
        # Get booking
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)
        
        # Check if user owns this booking
        if booking.customer.id != request.user.id:
            return Response({"error": "Not your booking"}, status=403)
        
        # Check if booking is completed
        if booking.status != 'completed':
            return Response({"error": "Booking must be completed to review"}, status=400)
        
        # Check if review already exists
        if Review.objects.filter(booking=booking).exists():
            return Response({"error": "Review already submitted"}, status=400)
        
        # Create review
        review = Review.objects.create(
            customer=request.user,
            booking=booking,
            rating=request.data.get('rating', 5),
            comment=request.data.get('comment', '')
        )
        
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=201)





