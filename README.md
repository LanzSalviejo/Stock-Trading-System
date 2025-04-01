# Stock Trading Management System

A stock trading management system built with React (Vite) and Flask.

## Features

- User authentication with role-based access (Admin, Manager, Trader)
- Portfolio summary and stock holdings display
- Transaction management (add and view transactions)
- Account creation functionality
- Role-specific dashboards

## Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database
cd backend
python init_db.py

# Start server
python app.py
```

## Database Setup

The application uses PostgreSQL. Make sure you have PostgreSQL installed and running.

1. Create a database named "Stock_Trading_Database"
2. Update connection parameters in `backend/db.py` if needed
3. Run the initialization script to create tables and test data:
   ```bash
   cd backend
   python init_db.py
   ```

## Test Accounts

- Admin: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Trader: `trader` / `trader123`

## API Endpoints

- `/api/login` - Authenticate users
- `/api/create_account` - Create new user accounts
- `/api/add_transaction` - Add a new stock transaction
- `/api/get_transactions` - Retrieve transactions for a user

## Development

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`