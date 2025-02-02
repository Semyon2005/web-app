from fastapi import APIRouter, Form
import sqlite3
router = APIRouter()

@router.get("/")
async def get_cities():
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    table_name = "cities"
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

@router.post("/")
async def set_sity(region: str = Form(), city: str = Form()):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    cursor.execute(f"INSERT INTO cities (region_id, city_name) \
                   VALUES ((SELECT id FROM regions WHERE region_name = '{region}'), '{city}')")

    connection.commit()
    connection.close()
    get_cities()