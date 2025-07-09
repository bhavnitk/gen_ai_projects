# Personal Expense Tracker

A full-stack web application to track and manage personal expenses, built with React, FastAPI, and PostgreSQL.

## Features

- Track expenses with categories, dates, and notes
- Visualize spending patterns with interactive charts
- Filter and search expenses
- Manage expense categories
- Responsive design for desktop and mobile

## Tech Stack

- **Frontend**: React, Material-UI, Chart.js, Formik, Axios
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd "Expense Tracker/backend"
   ```

2. Run the setup script:

   ```
   ./setup.sh
   ```

   This will:

   - Create a virtual environment
   - Install dependencies
   - Create the PostgreSQL database
   - Initialize the database with sample categories

3. Start the backend server:

   ```
   source venv/bin/activate
   cd app
   uvicorn main:app --reload
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd "Expense Tracker/frontend"
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

   The application will be available at http://localhost:3000

## API Documentation

Once the backend is running, you can access the Swagger documentation at:
http://localhost:8000/docs

## Database Schema

### Expenses

- id: Integer (Primary Key)
- title: String
- amount: Float
- date: DateTime
- notes: Text (Optional)
- category_id: Integer (Foreign Key)

### Categories

- id: Integer (Primary Key)
- name: String (Unique)

## License

MIT
