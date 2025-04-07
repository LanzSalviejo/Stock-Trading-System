from flask import request, jsonify, g
import psycopg2
from enum import Enum

import getStock
from db import get_db_connection


class Role(Enum):
    admin = 0
    trader = 1
    manager = 2


def login():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({"status": "success"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided", "status": "failure"}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username and password are required", "status": "failure"}), 400

        # Retrieve user from the database
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT id, username, password, role FROM users WHERE username = %s",
                (username,)
            )
            user = cur.fetchone()
            cur.close()
            conn.close()

            if user:
                db_id, db_username, db_password, db_role = user
                # Compare plaintext password
                if db_password == password:
                    return jsonify({
                        "message": "Login successful!",
                        "status": "success",
                        "role": db_role,
                        "userId": db_id
                    })
                else:
                    return jsonify({"message": "Invalid credentials", "status": "failure"}), 401
            else:
                return jsonify({"message": "User not found", "status": "failure"}), 404

        except Exception as e:
            return jsonify({"message": f"Database error: {str(e)}", "status": "failure"}), 500

    return jsonify({"message": "Method not allowed", "status": "failure"}), 405

def create_account():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = jsonify({"status": "success"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided", "status": "failure"}), 400

        username = data.get('username')
        password = data.get('password')
        user_role = data.get('userRole')

        # Validate input
        if not username or not password or not user_role:
            return jsonify({"error": "Missing username, password, or userRole"}), 400

        if user_role not in [1, 2]:
            return jsonify({"error": "Invalid userRole. Must be 1 (trader) or 2 (manager)"}), 400

        # Insert the new user into the database
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
                (username, password, user_role)
            )
            conn.commit()
            cur.close()
            return jsonify({"message": "Account created successfully", "status": "success"}), 201
        except psycopg2.IntegrityError:
            return jsonify({"error": "Username already exists", "status": "failure"}), 409
        except Exception as e:
            return jsonify({"error": str(e), "status": "failure"}), 500

    return jsonify({"message": "Method not allowed", "status": "failure"}), 405

def add_transaction():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "success"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided", "status": "failure"}), 400

        transactionid = data.get('transactionid')
        userid = data.get('userid')
        stocksymbol = data.get('stocksymbol')
        date = data.get('date')
        price = data.get('price')
        quantity = data.get('quantity')

        if not all([transactionid, userid, stocksymbol, date, price, quantity]):
            return jsonify({"message": "Missing required fields", "status": "failure"}), 400

        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                """
                INSERT INTO transactions (transactionid, userid, stocksymbol, date, price, quantity)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (transactionid, userid, stocksymbol, date, price, quantity)
            )
            conn.commit()
            cur.close()
            return jsonify({"message": "Transaction added successfully", "status": "success"}), 201
        except psycopg2.IntegrityError:
            return jsonify({"message": "Transaction ID already exists", "status": "failure"}), 409
        except Exception as e:
            return jsonify({"message": f"Database error: {str(e)}", "status": "failure"}), 500

    return jsonify({"message": "Method not allowed", "status": "failure"}), 405

def get_transactions():
    userid = request.args.get('userid')
    if not userid:
        return jsonify({"message": "User ID is required", "status": "failure"}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM transactions WHERE userid = %s", (userid,))
        transactions = cur.fetchall()
        cur.close()
        
        transactions_list = []
        if transactions:
            transactions_list = [
                {
                    "transactionid": t[0],
                    "userid": t[1],
                    "stocksymbol": t[2],
                    "date": str(t[3]),
                    "price": float(t[4]),  # Convert to float for JSON serialization
                    "quantity": int(t[5])   # Convert to int for JSON serialization
                } for t in transactions
            ]
        
        return jsonify({"transactions": transactions_list, "status": "success"}), 200
    except Exception as e:
        print(f"Database error: {str(e)}")
        # Return empty list with success status instead of 500 error
        return jsonify({"transactions": [], "status": "success"}), 200

def get_popular_stocks():
    try:
        stocks = getStock.get_popularStocks()
        return jsonify({"stocks": stocks, "status": "success"}), 200
    except Exception as e:
        print(f"Error in get_popular_stocks route: {str(e)}")
        return jsonify({"message": f"Error fetching popular stocks: {str(e)}", "status": "failure"}), 500

def get_stock():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "success"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({"message":"No stock provided", "status":"failure"}), 400
            
        symbol = data.get("symbol")
        if not symbol:
            return jsonify({"message":"Stock symbol is required", "status":"failure"}), 400
        
        # Period and Interval Values
        period_value = data.get("period")
        interval_value = data.get("interval")
        
        try:
            # Convert string values to enum if provided
            period = None
            interval = None
            
            if period_value:
                try:
                    period = getStock.Period[period_value]
                except KeyError:
                    return jsonify({"message": f"Invalid period value: {period_value}", "status": "failure"}), 400
            
            if interval_value:
                try:
                    interval = getStock.Interval[interval_value]
                except KeyError:
                    return jsonify({"message": f"Invalid interval value: {interval_value}", "status": "failure"}), 400
            
            stock_data = getStock.getBy_PeriodInterval(symbol, period, interval)
            
            if 'error' in stock_data:
                return jsonify({"message": stock_data['error'], "status": "failure"}), 400
                
            return jsonify({"stockData": stock_data, "status": "success"}), 200
        except Exception as e:
            print(f"Error in get_stock route: {str(e)}")
            return jsonify({"message": f"Error fetching stock data: {str(e)}", "status": "failure"}), 500