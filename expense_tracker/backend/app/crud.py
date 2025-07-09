from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime

# CRUD for expenses
def get_expense(db: Session, expense_id: int):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()

def get_expenses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Expense).offset(skip).limit(limit).all()

def create_expense(db: Session, expense: schemas.ExpenseCreate):
    date = expense.date or datetime.now()
    db_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        date=date,
        notes=expense.notes,
        category_id=expense.category_id
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def update_expense(db: Session, expense_id: int, expense: schemas.ExpenseUpdate):
    db_expense = get_expense(db, expense_id)
    
    if expense.title is not None:
        db_expense.title = expense.title
    if expense.amount is not None:
        db_expense.amount = expense.amount
    if expense.date is not None:
        db_expense.date = expense.date
    if expense.notes is not None:
        db_expense.notes = expense.notes
    if expense.category_id is not None:
        db_expense.category_id = expense.category_id
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    db_expense = get_expense(db, expense_id)
    db.delete(db_expense)
    db.commit()
    return db_expense

# CRUD for categories
def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_category_by_name(db: Session, name: str):
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
