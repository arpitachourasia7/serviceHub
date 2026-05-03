from django.urls import path
from . import views

urlpatterns = [
    path('submit/<uuid:booking_id>/', views.SubmitReviewView.as_view(), name='submit_review'),
    path('my-reviews/', views.MyReviewsView.as_view(), name='my_reviews'),
]