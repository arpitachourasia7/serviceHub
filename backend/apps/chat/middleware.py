from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
import jwt
from django.conf import settings

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
      
        query_string = scope.get('query_string', b'').decode()
        print(f"🔍 Full query string: {query_string}")
        
        query_params = parse_qs(query_string)
        print(f"🔍 Parsed params: {query_params}")
        

        token = query_params.get('token', [None])[0]
        
        if token:
            print(f"🔍 Token received: {token[:50]}...")
            print(f"🔍 Token length: {len(token)}")
            
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
                
                access_token = AccessToken(token)
                user_id = access_token.get('user_id')
                
                print(f"✅ Token decoded successfully!")
                print(f"✅ User ID from token: {user_id}")
                
                if user_id:
                    user = await self.get_user(user_id)
                    if user and not user.is_anonymous:
                        scope['user'] = user
                        print(f"✅ User authenticated: {user.username} (ID: {user.id})")
                    else:
                        print(f"❌ User not found for ID: {user_id}")
                        scope['user'] = AnonymousUser()
                else:
                    print("❌ No user_id in token")
                    scope['user'] = AnonymousUser()
                    
            except Exception as e:
                print(f"❌ Token authentication failed: {type(e).__name__}: {e}")
                import traceback
                traceback.print_exc()
                scope['user'] = AnonymousUser()
        else:
            print("⚠️ No token found in query string")
            scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)
    
    @database_sync_to_async
    def get_user(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:

            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            print(f"User with ID {user_id} not found")
            return AnonymousUser()
        except Exception as e:
            print(f"Error getting user: {e}")
            return AnonymousUser()