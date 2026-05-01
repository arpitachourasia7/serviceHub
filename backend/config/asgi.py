#import os
#import django
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
#django.setup()

#from django.core.asgi import get_asgi_application
#from channels.routing import ProtocolTypeRouter, URLRouter
#from channels.security.websocket import AllowedHostsOriginValidator
#from apps.chat.middleware import JwtAuthMiddleware
#import apps.chat.routing as chat_routing

#application = ProtocolTypeRouter({
 #   "http": get_asgi_application(),
  #  "websocket": AllowedHostsOriginValidator(
   #     JwtAuthMiddleware(
    #        URLRouter(chat_routing.websocket_urlpatterns)
     #   )
    #),
#})



















# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from apps.chat.routing import websocket_urlpatterns

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(websocket_urlpatterns)
#     ),
# })




# backend/config/asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Initialize Django ASGI
django_asgi_app = get_asgi_application()

# Import channel modules after Django is ready
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from apps.chat.routing import websocket_urlpatterns
from apps.chat.middleware import TokenAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(  # Use your custom middleware
            URLRouter(websocket_urlpatterns)
        )
    ),
})