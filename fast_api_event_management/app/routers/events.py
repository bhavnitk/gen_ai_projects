from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models.event import Event, EventAttendee
from app.schemas.event import EventCreate, Event as EventSchema, EventUpdate, EventDetail, EventAttendeeCreate

router = APIRouter(
    prefix="/events",
    tags=["events"],
    responses={404: {"description": "Event not found"}}
)

@router.post("/", response_model=EventSchema, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new event
    """
    db_event = Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventSchema])
async def read_events(
    skip: int = 0, 
    limit: int = 100,
    title: Optional[str] = None,
    location: Optional[str] = None,
    start_date: Optional[datetime] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve events with optional filtering
    """
    query = db.query(Event)
    
    # Apply filters if provided
    if title:
        query = query.filter(Event.title.ilike(f"%{title}%"))
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    if start_date:
        query = query.filter(Event.start_date >= start_date)
    if is_active is not None:
        query = query.filter(Event.is_active == is_active)
        
    events = query.offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventDetail)
async def read_event(
    event_id: int, 
    db: Session = Depends(get_db)
):
    """
    Get a specific event by ID
    """
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.put("/{event_id}", response_model=EventSchema)
async def update_event(
    event_id: int, 
    event: EventUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an event
    """
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Update only the fields that are provided
    update_data = event.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete an event
    """
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(db_event)
    db.commit()
    return None

@router.post("/{event_id}/attendees", status_code=status.HTTP_201_CREATED)
async def add_attendee(
    event_id: int,
    attendee: EventAttendeeCreate,
    db: Session = Depends(get_db)
):
    """
    Register a user as an attendee for an event
    """
    # Check if event exists
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if user is already registered
    existing_attendee = db.query(EventAttendee).filter(
        EventAttendee.event_id == event_id,
        EventAttendee.user_id == attendee.user_id
    ).first()
    
    if existing_attendee:
        raise HTTPException(
            status_code=400, 
            detail="User is already registered for this event"
        )
    
    # Create new attendee
    db_attendee = EventAttendee(
        event_id=event_id,
        user_id=attendee.user_id,
        attended=attendee.attended
    )
    
    db.add(db_attendee)
    db.commit()
    db.refresh(db_attendee)
    
    return {"message": "Attendee added successfully"}

@router.delete("/{event_id}/attendees/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_attendee(
    event_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Remove a user from an event's attendee list
    """
    # Check if registration exists
    db_attendee = db.query(EventAttendee).filter(
        EventAttendee.event_id == event_id,
        EventAttendee.user_id == user_id
    ).first()
    
    if db_attendee is None:
        raise HTTPException(
            status_code=404, 
            detail="User is not registered for this event"
        )
    
    db.delete(db_attendee)
    db.commit()
    
    return None

@router.get("/{event_id}/attendees", response_model=List[dict])
async def get_event_attendees(
    event_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all attendees for a specific event
    """
    # Check if event exists
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Get attendees
    attendees = db.query(EventAttendee).filter(EventAttendee.event_id == event_id).all()
    return attendees
