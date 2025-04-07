from flask import Flask
from flask_cors import CORS  # Import CORS
from routes import create_account, login, add_transaction, get_transactions, get_popular_stocks, get_stock
from db import close_db_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Registering routes
app.add_url_rule('/api/login', 'login', login, methods=['OPTIONS', 'POST'])
app.add_url_rule('/api/create_account', 'create_account', create_account, methods=['OPTIONS', 'POST'])
app.add_url_rule('/api/add_transaction', 'add_transaction', add_transaction, methods=['OPTIONS', 'POST'])
app.add_url_rule('/api/get_transactions', 'get_transactions', get_transactions, methods=['GET'])
app.add_url_rule('/api/get_popular_stocks', 'get_popular_stocks', get_popular_stocks, methods=['GET'])
app.add_url_rule('/api/get_stock', 'get_stock', get_stock, methods=['OPTIONS', 'POST'])

if __name__ == '__main__':
    app.run(debug=True)

@app.teardown_appcontext
def teardown_db(exception):
    close_db_connection(exception)