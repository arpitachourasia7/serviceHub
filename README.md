# serviceHub

ServiceHub is a service marketplace web application built with Django REST Framework on the backend and React/Vite on the frontend. It supports customer and provider user roles, service listings, booking management, reviews, and chat.

## Setup Instructions

### Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install backend dependencies. If a `requirements.txt` file is not present, install the core packages manually:
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers channels drf-yasg mysqlclient
   ```
4. Configure database credentials in `backend/config/settings.py` if needed.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the app in the browser at the URL shown by Vite (usually `http://localhost:5173`).

## Feature List

- User authentication with JWT tokens
- Two roles: `customer` and `provider`
- Customer registration and login
- Provider registration and service creation
- Service discovery with search and ordering support
- Booking creation and status management
- Reviews submission after service completion
- Chat / conversation endpoints for customer-provider messaging
- User profile support and provider listing

## API Documentation

### Base URL
- Backend API base: `http://127.0.0.1:8000/api`

### Authentication
- `POST /api/users/register/`
  - Body: `username`, `email`, `password`, `password2`, `role`, `first_name`, `last_name`, `phone`, `address`
  - Required fields: `username`, `email`, `password`, `password2`, `role`
  - Response: `access`, `refresh`, `user`
- `POST /api/users/login/`
  - Body: `username`, `password`
  - Login accepts either username or email in the `username` field.
  - Response: `access`, `refresh`, `user`
- Protected requests require header:
  ```http
  Authorization: Bearer <access_token>
  ```

### User
- `GET /api/users/profile/`
  - Retrieve authenticated user profile
- `PUT /api/users/profile/`
  - Update authenticated user profile
- `GET /api/users/providers/`
  - List all registered service providers

### Services
- `GET /api/services/`
  - List active services
- `POST /api/services/`
  - Create a new service (provider role only)
- `GET /api/services/{id}/`
  - Retrieve service details
- `PUT /api/services/{id}/`
  - Update service (provider owner only)
- `PATCH /api/services/{id}/`
  - Partially update service
- `DELETE /api/services/{id}/`
  - Delete service (provider owner only)

### Bookings
- `GET /api/bookings/`
  - List bookings for the authenticated customer or provider
- `POST /api/bookings/`
  - Create a booking for a service
  - Body: `service`, `notes`
- `GET /api/bookings/{id}/`
  - Retrieve booking details
- `PATCH /api/bookings/{id}/`
  - Update booking status
  - Provider actions: `accepted`, `rejected`, `completed`
  - Customer action: `cancelled`

### Reviews
- `POST /api/reviews/submit/{booking_id}/`
  - Submit a review for a completed booking
  - Body: `rating`, `comment`
- `GET /api/reviews/my-reviews/`
  - Retrieve reviews for the authenticated user

### Chat
- `GET /api/chat/conversations/`
  - List conversations for authenticated user
- `POST /api/chat/conversations/create/`
  - Create a new conversation
- `GET /api/chat/conversations/{conversation_id}/messages/`
  - List messages for a conversation
- `POST /api/chat/messages/`
  - Send a chat message
- `POST /api/chat/conversations/{conversation_id}/read/`
  - Mark conversation messages as read

## Notes
- Passwords must meet Django's password validation rules.
- The app uses a custom `User` model with `role` support in `backend/apps/users/models.py`.
- The frontend expects the backend API at `http://127.0.0.1:8000/api`.
