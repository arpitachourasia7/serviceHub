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














# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from .models import Conversation, Message

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
#         self.room_group_name = f"chat_{self.conversation_id}"
        
#         print(f"WebSocket connecting to room: {self.room_group_name}")
        
#         # Accept the connection
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()
        
#         print(f"WebSocket connected successfully: {self.channel_name}")

#     async def disconnect(self, close_code):
#         print(f"WebSocket disconnected: {close_code}")
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         print(f"Received message: {text_data}")
        
#         try:
#             data = json.loads(text_data)
#             message_type = data.get("type", "message")

#             if message_type == "message":
#                 content = data.get("content", "").strip()
#                 if content:
#                     # Save message to database
#                     message = await self.save_message(content)
                    
#                     # Send to group
#                     await self.channel_layer.group_send(
#                         self.room_group_name,
#                         {
#                             "type": "chat_message",
#                             "message_id": str(message["id"]),
#                             "content": message["content"],
#                             "sender_id": message["sender_id"],
#                             "sender_name": message["sender_name"],
#                             "created_at": message["created_at"],
#                         },
#                     )
#         except Exception as e:
#             print(f"Error processing message: {e}")

#     async def chat_message(self, event):
#         print(f"Sending message to WebSocket: {event}")
#         await self.send(text_data=json.dumps({
#             "type": "message",
#             "message_id": event["message_id"],
#             "content": event["content"],
#             "sender_id": event["sender_id"],
#             "sender_name": event["sender_name"],
#             "created_at": event["created_at"],
#         }))

#     @database_sync_to_async
#     def save_message(self, content):
#         from .models import Conversation, Message
#         user = self.scope["user"]
#         conv = Conversation.objects.get(id=self.conversation_id)
        
#         # Check if user is participant
#         if user != conv.customer and user != conv.provider:
#             return None
        
#         msg = Message.objects.create(conversation=conv, sender=user, content=content)
#         conv.save()
        
#         return {
#             "id": str(msg.id),
#             "content": msg.content,
#             "sender_id": str(msg.sender.id),
#             "sender_name": msg.sender.username,
#             "created_at": msg.created_at.isoformat(),
#         }






import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("=" * 50)
        print("CHAT CONSUMER: Connect method called")
        
        # Get conversation ID from URL
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"
        
        # Get user from scope (now available due to AuthMiddlewareStack)
        self.user = self.scope.get('user', AnonymousUser())
        
        print(f"User: {self.user}")
        print(f"Is authenticated: {not self.user.is_anonymous}")
        print(f"Conversation ID: {self.conversation_id}")
        
        # Add to group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()
        print(f"✅ WebSocket ACCEPTED for room: {self.room_group_name}")
        
        # Send welcome message
        await self.send(text_data=json.dumps({
            "type": "connection",
            "message": "Connected to chat successfully!",
            "conversation_id": self.conversation_id,
            "user": str(self.user),
            "authenticated": not self.user.is_anonymous
        }))
    
    async def disconnect(self, close_code):
        print(f"WebSocket DISCONNECTED: {close_code}")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        print(f"📨 Received message: {text_data}")
        
        try:
            data = json.loads(text_data)
            message_type = data.get("type", "message")
            
            if message_type == "message":
                content = data.get("content", "")
                print(f"Processing message: {content}")
                
                message_id = None
                created_at = None
                
                # Save message to database
                if not self.user.is_anonymous:
                    saved_msg = await self.save_message(content)
                    if saved_msg:
                        message_id = str(saved_msg.id)
                        created_at = saved_msg.created_at.isoformat()
                
                # Broadcast to everyone in the group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "content": content,
                        "sender": self.user.username,
                        "sender_id": str(self.user.id),
                        "message_id": message_id,
                        "created_at": created_at
                    }
                )
                print(f"✅ Message broadcasted to group: {self.room_group_name}")
            
            elif message_type == "typing":
                # Send typing indicator to group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "typing_indicator",
                        "sender": self.user.username,
                        "sender_id": str(self.user.id),
                        "is_typing": data.get("is_typing", False)
                    }
                )
            
            else:
                # Echo back for testing
                await self.send(text_data=json.dumps({
                    "type": "echo",
                    "received": data,
                    "message": "Server received your message!"
                }))
                
        except Exception as e:
            print(f"Error processing message: {e}")
            import traceback
            traceback.print_exc()
    
    async def chat_message(self, event):
        """Send message to WebSocket"""
        print(f"📤 Sending message to client: {event}")
        await self.send(text_data=json.dumps({
            "type": "message",
            "content": event["content"],
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "message_id": event.get("message_id"),
            "created_at": event.get("created_at")
        }))
    
    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket"""
        await self.send(text_data=json.dumps({
            "type": "typing",
            "sender": event["sender"],
            "sender_id": event["sender_id"],
            "is_typing": event["is_typing"]
        }))
    
    @database_sync_to_async
    def save_message(self, content):
        """Save message to database and return saved message"""
        try:
            from .models import Conversation, Message
            
            conv = Conversation.objects.get(id=self.conversation_id)
            msg = Message.objects.create(
                conversation=conv,
                sender=self.user,
                content=content
            )
            print(f"✅ Message saved to database: {msg.id}")
            return msg
        except Exception as e:
            print(f"Error saving message: {e}")
            return None