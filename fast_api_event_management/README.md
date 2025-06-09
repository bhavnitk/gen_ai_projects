# Event Management API

A comprehensive RESTful API for managing events, built with FastAPI.

## Features

- **User Management**: Register, update, and manage user accounts
- **Event Management**: Create, read, update, and delete events
- **Attendee Management**: Register users for events and track attendance
- **API Documentation**: Auto-generated interactive API documentation

## Tech Stack

- **FastAPI**: High-performance web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **SQLite**: Simple file database (for development, can be replaced with PostgreSQL/MySQL for production)

## Project Structure

```
app/
├── __init__.py
├── main.py                 # FastAPI application creation and configuration
├── database/               # Database connection and session management
│   ├── __init__.py
│   └── database.py
├── models/                 # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── event.py
│   └── user.py
├── routers/                # API routes
│   ├── __init__.py
│   ├── events.py
│   └── users.py
└── schemas/                # Pydantic models for request/response validation
    ├── __init__.py
    ├── event.py
    └── user.py
```

## API Endpoints

### Users

- `POST /users/`: Create a new user
- `GET /users/`: Get list of all users
- `GET /users/{user_id}`: Get user details by ID
- `PUT /users/{user_id}`: Update user information
- `DELETE /users/{user_id}`: Delete a user
- `GET /users/{user_id}/events`: Get events created by a specific user

### Events

- `POST /events/`: Create a new event
- `GET /events/`: Get list of all events (with filtering options)
- `GET /events/{event_id}`: Get event details by ID
- `PUT /events/{event_id}`: Update event information
- `DELETE /events/{event_id}`: Delete an event
- `POST /events/{event_id}/attendees`: Register a user for an event
- `DELETE /events/{event_id}/attendees/{user_id}`: Remove a user from an event
- `GET /events/{event_id}/attendees`: Get all attendees for a specific event

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/event-management-api.git
   cd event-management-api
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:

   ```bash
   uvicorn app.main:app --reload
   ```

5. Access the API documentation:
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

## Development

### Database Migrations

This project uses SQLAlchemy models to create the database schema. The tables are automatically created on startup if they don't exist.

For production environments, consider using Alembic for database migrations.

### Environment Variables

For production, consider using environment variables for configuration settings like database URLs and secret keys.

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
