# from rest_framework import generics, permissions, filters
# from rest_framework.response import Response
# from .models import Service
# from .serializers import ServiceSerializer

# class ServiceListView(generics.ListCreateAPIView):
#     serializer_class = ServiceSerializer
#     permission_classes = (permissions.IsAuthenticated,)
#     filter_backends = [filters.SearchFilter, filters.OrderingFilter]
#     search_fields = ['title', 'description', 'category']
#     ordering_fields = ['price', 'created_at']
    
#     def get_queryset(self):
#         if self.request.user.is_provider:
#             return Service.objects.filter(provider=self.request.user, is_active=True)
#         return Service.objects.filter(is_active=True)
    
#     def perform_create(self, serializer):
#         if self.request.user.is_provider:
#             serializer.save(provider=self.request.user)
#         else:
#             raise permissions.PermissionDenied("Only service providers can create services")

# class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
#     serializer_class = ServiceSerializer
#     permission_classes = (permissions.IsAuthenticated,)
    
#     def get_queryset(self):
#         if self.request.user.is_provider:
#             return Service.objects.filter(provider=self.request.user)
#         return Service.objects.filter(is_active=True)

#     def perform_update(self, serializer):
#         instance = self.get_object()
#         if self.request.user.is_provider and instance.provider == self.request.user:
#             serializer.save()
#         else:
#             raise permissions.PermissionDenied("Only the service owner can update this service")

#     def perform_destroy(self, instance):
#         if self.request.user.is_provider and instance.provider == self.request.user:
#             instance.delete()
#         else:
#             raise permissions.PermissionDenied("Only the service owner can delete this service")
















from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from .models import Service
from .serializers import ServiceSerializer

class ServiceListView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['price', 'created_at']
    
    def get_queryset(self):
        # Check if user is authenticated before accessing is_provider
        if self.request.user.is_authenticated:
            # Check if is_provider attribute exists, default to False
            is_provider = getattr(self.request.user, 'is_provider', False)
            if is_provider:
                return Service.objects.filter(provider=self.request.user, is_active=True)
        return Service.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        # Check if user is authenticated and is a provider
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("Authentication required")
        
        is_provider = getattr(self.request.user, 'is_provider', False)
        if is_provider:
            serializer.save(provider=self.request.user)
        else:
            raise permissions.PermissionDenied("Only service providers can create services")

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        # Check if user is authenticated before accessing is_provider
        if self.request.user.is_authenticated:
            is_provider = getattr(self.request.user, 'is_provider', False)
            if is_provider:
                return Service.objects.filter(provider=self.request.user)
        return Service.objects.filter(is_active=True)

    def perform_update(self, serializer):
        instance = self.get_object()
        
        # Check if user is authenticated and is the service owner
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("Authentication required")
        
        is_provider = getattr(self.request.user, 'is_provider', False)
        if is_provider and instance.provider == self.request.user:
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only the service owner can update this service")

    def perform_destroy(self, instance):
        # Check if user is authenticated and is the service owner
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("Authentication required")
        
        is_provider = getattr(self.request.user, 'is_provider', False)
        if is_provider and instance.provider == self.request.user:
            instance.delete()
        else:
            raise permissions.PermissionDenied("Only the service owner can delete this service")