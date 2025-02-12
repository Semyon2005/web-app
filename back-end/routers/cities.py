from fastapi import APIRouter, Form
from pydantic import BaseModel
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

class CityData(BaseModel):
    region: str
    city: str

@router.post("/")
async def set_sity(data: CityData):
    region = data.region
    city = data.city
    print(region, city)
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    cursor.execute(f"INSERT INTO cities (region_id, city_name) \
                   VALUES ((SELECT id FROM regions WHERE region_name = '{region}'), '{city}')")

    connection.commit()
    connection.close()
    get_cities()

@router.delete("/{item_id}")
async def del_sity(item_id: int):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    cursor.execute(
        f'DELETE FROM cities \
          WHERE id == {item_id}'
    )

    connection.commit()
    connection.close()