from fastapi import APIRouter, Request
from pydantic import BaseModel
import sqlite3

router = APIRouter()

@router.get("/")
async def get_regions(request: Request):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    table_name = "regions"
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

@router.post("/")
async def set_region(data: CityData):
    region = data.region
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    cursor.execute(f"INSERT INTO regions (region_name) \
                   VALUES ('{region}')")

    connection.commit()
    connection.close()
    return {'region': region}


@router.delete("/{region_id}")
async def del_region(region_id: int):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    cursor.execute(f'SELECT * FROM regions WHERE id={region_id}')
    data = cursor.fetchall()
    cursor.execute(f'pragma table_info(cities)')
    head = cursor.fetchall()[1]
    for_json = {head[i]: data[i] for i in range(len(data))}
    cursor.execute(f'DELETE FROM regions WHERE id={region_id}')
    connection.commit()
    connection.close()
    return for_json
    