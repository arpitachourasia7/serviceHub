from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListView.as_view(), name='booking-list'),
    path('<uuid:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
]