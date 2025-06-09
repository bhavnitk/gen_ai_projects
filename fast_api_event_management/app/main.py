from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, events
from app.database.database import engine
from app.models import user, event

# Create database tables
user.Base.metadata.create_all(bind=engine)
event.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Event Management API",
    description="A FastAPI application for managing events with CRUD operations",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(events.router)

@app.get("/")
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Welcome to the FastAPI application"}

