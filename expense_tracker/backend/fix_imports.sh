#!/bin/zsh

echo "Fixing backend import issues..."

# Make sure we're in the backend directory
cd "/Users/bhavnitk/Expense Tracker/backend"

# Activate the virtual environment
source venv/bin/activate

# Fix the import in models.py
sed -i '' 's/from app\.database import Base/from database import Base/g' app/models.py

# Fix the import in main.py
sed -i '' 's/from app import models, schemas, crud/import models, schemas, crud/g' app/main.py

# Fix the import in crud.py
sed -i '' 's/from app import models, schemas/import models, schemas/g' app/crud.py

# Create an empty __init__.py file in the app directory to make it a proper package
touch app/__init__.py

echo "Creating database if it doesn't exist..."
createdb expense_tracker || echo "Database already exists"

echo "Initializing database..."
python init_db.py

echo "Backend setup completed successfully!"
echo "To start the backend server, run:"
echo "cd '/Users/bhavnitk/Expense Tracker/backend' && source venv/bin/activate && cd app && uvicorn main:app --reload"
