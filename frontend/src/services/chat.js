import api from './Api';

export const getConversations = () => api.get('/chat/conversations/');

export const createConversation = (providerId, serviceId = null, bookingId = null) =>
    api.post('/chat/conversations/create/', {
        provider: providerId,
        service: serviceId,
        booking: bookingId,
    });

export const getMessages = (conversationId) =>
    api.get(`/chat/conversations/${conversationId}/messages/`);

export const sendMessage = (conversationId, content) =>
    api.post('/chat/messages/', { conversation: conversationId, content });

export const markMessagesRead = (conversationId) =>
    api.post(`/chat/conversations/${conversationId}/read/`);