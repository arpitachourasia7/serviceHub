from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.bookings.models import Booking
from apps.chat.models import Conversation

@receiver(post_save, sender=Booking)
def create_chat_conversation(sender, instance, created, **kwargs):
    """Auto-create a chat conversation when a new booking is created"""
    if created:
        conversation, new_created = Conversation.objects.get_or_create(
            customer=instance.customer,
            provider=instance.service.provider,
            service=instance.service,
            booking=instance
        )
        if new_created:
            print(f"✅ Auto-created conversation for Booking {instance.id}")
        else:
            print(f"✓ Conversation already existed for Booking {instance.id}")