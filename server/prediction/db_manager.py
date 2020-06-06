import json
import psycopg2
# db methods


def connect(env='development'):
    with open('config/config.json') as file:
        data = file.read()
    conn = json.loads(data)[env]
    conn_string = f"host='{conn['host']}' dbname='{conn['database']}' user='{conn['username']}' password='{conn['password']}'"
    connection = psycopg2.connect(conn_string)
    return connection
