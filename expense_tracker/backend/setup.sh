#!/bin/zsh

echo "Setting up the Expense Tracker backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Check PostgreSQL status
echo "Checking PostgreSQL status..."
if ! pg_isready -q; then
    echo "PostgreSQL is not running. Attempting to start it..."
    brew services start postgresql || pg_ctl -D /usr/local/var/postgres start || echo "Failed to start PostgreSQL. Please start it manually."
    sleep 2  # Give it a moment to start
fi

# Create PostgreSQL database
echo "Creating PostgreSQL database 'expense_tracker'..."
createdb expense_tracker || echo "Database may already exist or there was an issue creating it."

# Initialize database with sample data
echo "Initializing database with sample data..."
python init_db.py

echo "Backend setup complete!"
echo "Run 'source venv/bin/activate && cd app && uvicorn main:app --reload' to start the backend server."
