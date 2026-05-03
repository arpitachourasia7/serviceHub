import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("=" * 50)
        print("CHAT CONSUMER: Connect method called")
        
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"
        
        self.user = self.scope.get('user', AnonymousUser())
        
        print(f"User: {self.user}")
        print(f"Is authenticated: {not self.user.is_anonymous}")
        print(f"Conversation ID: {self.conversation_id}")
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        print(f"✅ WebSocket ACCEPTED for room: {self.room_group_name}")
        

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
                

                if not self.user.is_anonymous:
                    saved_msg = await self.save_message(content)
                    if saved_msg:
                        message_id = str(saved_msg.id)
                        created_at = saved_msg.created_at.isoformat()
                
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