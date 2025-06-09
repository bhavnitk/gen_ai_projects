from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Event(Base):
    """
    Event database model for storing event information
    """
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(100), nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    organizer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Define the relationship with the User model
    organizer = relationship("User", back_populates="events")
    attendees = relationship("EventAttendee", back_populates="event", cascade="all, delete-orphan")

class EventAttendee(Base):
    """
    Model for storing event attendees
    """
    __tablename__ = "event_attendees"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    registration_date = Column(DateTime, default=datetime.utcnow)
    attended = Column(Boolean, default=False)

    # Define relationships
    event = relationship("Event", back_populates="attendees")
    user = relationship("User", back_populates="attending_events")
