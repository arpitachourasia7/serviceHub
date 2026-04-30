from django.urls import path
from . import views

urlpatterns = [
    path('', views.ServiceListView.as_view(), name='service-list'),
    path('<uuid:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
]