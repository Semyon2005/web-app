from fastapi import APIRouter, Request
import sqlite3
router = APIRouter()

@router.get("/")
async def get_users(request: Request):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    table_name = "users"
    cursor.execute(f'PRAGMA table_info({table_name})')
    headers = [i[1] for i in cursor.fetchall()]
    response = {str(headers[i]): [] for i in range(len(headers))}
    cursor.execute(f'SELECT * FROM {table_name}')
    for row in cursor.fetchall():
        for header, item in zip(response, range(len(row))):
            response[header].append(row[item])
    cursor.close()
    connection.close()
    return response