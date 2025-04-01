from flask import request, jsonify, g
import psycopg2
from db import get_db_connection

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
                "SELECT username, password, role FROM users WHERE username = %s",
                (username,)
            )
            user = cur.fetchone()
            cur.close()
            conn.close()

            if user:
                db_username, db_password, db_role = user
                # Compare plaintext password
                if db_password == password:
                    return jsonify({
                        "message": "Login successful!",
                        "status": "success",
                        "role": db_role
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
                "INSERT INTO users (username, password_hash, role) VALUES (%s, %s, %s)",
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
        
        transactions_list = [
            {
                "transactionid": t[0],
                "userid": t[1],
                "stocksymbol": t[2],
                "date": str(t[3]),
                "price": t[4],
                "quantity": t[5]
            } for t in transactions
        ]
        
        return jsonify({"transactions": transactions_list, "status": "success"}), 200
    except Exception as e:
        return jsonify({"message": f"Database error: {str(e)}", "status": "failure"}), 500