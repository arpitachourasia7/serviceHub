from django.urls import path
from .views import (
    ConversationListView,
    ConversationCreateView,
    MessageListView,
    MessageCreateView,
    MarkMessagesReadView,
)

urlpatterns = [
    path("conversations/", ConversationListView.as_view()),
    path("conversations/create/", ConversationCreateView.as_view()),
    path("conversations/<uuid:conversation_id>/messages/", MessageListView.as_view()),
    path("messages/", MessageCreateView.as_view()),
    path("conversations/<uuid:conversation_id>/read/", MarkMessagesReadView.as_view()),
]