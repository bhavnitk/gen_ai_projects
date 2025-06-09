from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List

class EventAttendeeBase(BaseModel):
    user_id: int
    attended: Optional[bool] = False

class EventAttendeeCreate(EventAttendeeBase):
    pass

class EventAttendee(EventAttendeeBase):
    id: int
    event_id: int
    registration_date: datetime
    
    # The Config class enables compatibility with ORM models by allowing attribute-based initialization.
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    location: str = Field(..., min_length=3, max_length=100)
    start_date: datetime
    end_date: datetime
    is_active: Optional[bool] = True

    @validator('end_date')
    def end_date_must_be_after_start_date(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class EventCreate(EventBase):
    organizer_id: int

class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    location: Optional[str] = Field(None, min_length=3, max_length=100)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    
    @validator('end_date')
    def end_date_must_be_after_start_date(cls, v, values):
        if v and 'start_date' in values and values['start_date'] and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v

class Event(EventBase):
    id: int
    organizer_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EventDetail(Event):
    attendees: List[EventAttendee] = []

    class Config:
        from_attributes = True
