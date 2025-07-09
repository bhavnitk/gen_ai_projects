import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app'))

from app.database import SessionLocal, engine
import models, schemas, crud

def init_db():
    db = SessionLocal()
    
    # Create default categories
    default_categories = [
        "Food & Dining",
        "Transportation",
        "Entertainment",
        "Housing",
        "Utilities",
        "Healthcare",
        "Personal Care",
        "Education",
        "Travel",
        "Shopping",
        "Gifts & Donations",
        "Miscellaneous"
    ]
    
    for category_name in default_categories:
        existing_category = crud.get_category_by_name(db, category_name)
        if not existing_category:
            category = schemas.CategoryCreate(name=category_name)
            crud.create_category(db, category)
    
    print("Database initialized with default categories!")
    db.close()

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    init_db()
