# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import Conversation, Message


# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
#         self.room_group_name = f"chat_{self.conversation_id}"

#         # Reject anonymous users
#         if not self.scope["user"] or not self.scope["user"].is_authenticated:
#             await self.close(code=4001)
#             return

#         # Reject users not part of this conversation
#         if not await self.is_conversation_participant():
#             await self.close(code=4003)
#             return

#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message_type = data.get("type", "message")

#         if message_type == "message":
#             content = data.get("content", "").strip()
#             if not content:
#                 return
#             message = await self.save_message(content)
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "chat_message",
#                     "message_id": str(message["id"]),
#                     "content": message["content"],
#                     "sender_id": message["sender_id"],
#                     "sender_name": message["sender_name"],
#                     "created_at": message["created_at"],
#                 },
#             )
#         elif message_type == "typing":
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "typing_indicator",
#                     "sender_name": self.scope["user"].username,
#                     "sender_id": str(self.scope["user"].id),
#                     "is_typing": data.get("is_typing", False),
#                 },
#             )

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps({
#             "type": "message",
#             "message_id": event["message_id"],
#             "content": event["content"],
#             "sender_id": event["sender_id"],
#             "sender_name": event["sender_name"],
#             "created_at": event["created_at"],
#         }))

#     async def typing_indicator(self, event):
#         await self.send(text_data=json.dumps({
#             "type": "typing",
#             "sender_name": event["sender_name"],
#             "sender_id": event["sender_id"],
#             "is_typing": event["is_typing"],
#         }))

#     @database_sync_to_async
#     def is_conversation_participant(self):
#         user = self.scope["user"]
#         try:
#             conv = Conversation.objects.get(id=self.conversation_id)
#             return user == conv.customer or user == conv.provider
#         except Conversation.DoesNotExist:
#             return False

#     @database_sync_to_async
#     def save_message(self, content):
#         user = self.scope["user"]
#         conv = Conversation.objects.get(id=self.conversation_id)
#         msg = Message.objects.create(conversation=conv, sender=user, content=content)
#         conv.save()  # bumps updated_at for sidebar ordering
#         return {
#             "id": msg.id,
#             "content": msg.content,
#             "sender_id": str(msg.sender.id),
#             "sender_name": msg.sender.username,
#             "created_at": msg.created_at.isoformat(),
#         }














import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"
        
        print(f"🔌 WebSocket connecting to room: {self.room_group_name}")
        
        # Add to group and accept
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        print(f"✅ WebSocket accepted for room: {self.room_group_name}")

    async def disconnect(self, close_code):
        print(f"🔌 WebSocket disconnecting: {close_code}")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        print(f"📨 Received message: {text_data}")
        
        try:
            data = json.loads(text_data)
            message_type = data.get("type", "message")
            
            if message_type == "message":
                content = data.get("content", "")
                sender_name = data.get("sender_name", "Unknown")
                
                print(f"💬 Message content: {content}")
                
                # Echo back to sender and broadcast to other clients
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "content": content,
                        "sender_name": sender_name,
                        "message_id": "test123"
                    }
                )
        except Exception as e:
            print(f"Error processing message: {e}")

    async def chat_message(self, event):
        print(f"📤 Sending message to client: {event}")
        
        await self.send(text_data=json.dumps({
            "type": "message",
            "content": event["content"],
            "sender_name": event["sender_name"],
            "message_id": event["message_id"]
        }))