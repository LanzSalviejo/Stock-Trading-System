import psycopg2
import os

def init_db():
    """Initialize the database with tables and sample data."""
    conn = psycopg2.connect(
        dbname="Stock_Trading_Database",
        user="postgres",
        password="1234",
        host="localhost",
        port="5432"
    )
    
    conn.autocommit = True
    cur = conn.cursor()
    
    # Read schema file
    with open('schema.sql', 'r') as f:
        schema = f.read()
    
    # Execute schema
    cur.execute(schema)
    
    print("Database initialized successfully!")
    
    # Close cursor and connection
    cur.close()
    conn.close()

if __name__ == "__main__":
    init_db()