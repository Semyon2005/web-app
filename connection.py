from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
import sqlite3
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_table(request: Request):
    connection = sqlite3.connect('my_database.db')
    cursor = connection.cursor()
    table_name = str(request.url.path)[1:]
    cursor.execute(f'PRAGMA table_info({table_name})')
    headers = [i[1] for i in cursor.fetchall()]
    response = {str(headers[i]): []  for i in range(len(headers))}
    cursor.execute(f'SELECT * FROM {table_name}')
    for row in cursor.fetchall():
        for header, item in zip(response, range(len(row))):
            response[header].append(row[item])



    return response

@app.get("/users")
def read_users(request: Request):
    return get_table(request)

@app.get("/regions")
def read_regions(request: Request):
    return get_table(request)

@app.get("/cities")
def read_cities(request: Request):
    return get_table(request)