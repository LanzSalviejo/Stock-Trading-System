-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,  -- In production, store password hash
    role VARCHAR(20) NOT NULL CHECK (role IN ('administrator', 'manager', 'trader'))
);

-- Insert default users (plain text passwords for testing only)
INSERT INTO users (username, password, role) 
VALUES 
    ('admin', 'admin123', 'administrator'),
    ('manager', 'manager123', 'manager'),
    ('trader', 'trader123', 'trader')
ON CONFLICT (username) DO NOTHING;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    transactionid VARCHAR(50) PRIMARY KEY,
    userid INTEGER NOT NULL,
    stocksymbol VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id)
);

-- Index for looking up transactions by user
CREATE INDEX IF NOT EXISTS idx_transactions_userid ON transactions(userid);