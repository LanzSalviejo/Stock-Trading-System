import psycopg2
from flask import g

def get_db_connection():
    if 'db_conn' not in g:
        g.db_conn = psycopg2.connect(
            dbname="Stock_Trading_Database",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432"
        )
    return g.db_conn

def close_db_connection(e=None):
    db_conn = g.pop('db_conn', None)
    if db_conn is not None:
        db_conn.close()
