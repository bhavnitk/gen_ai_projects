from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Category schemas
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True

# Expense schemas
class ExpenseBase(BaseModel):
    title: str
    amount: float
    notes: Optional[str] = None
    category_id: int

class ExpenseCreate(ExpenseBase):
    date: Optional[datetime] = None

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    notes: Optional[str] = None
    category_id: Optional[int] = None
    date: Optional[datetime] = None

class Expense(ExpenseBase):
    id: int
    date: datetime
    category: Category

    class Config:
        orm_mode = True
