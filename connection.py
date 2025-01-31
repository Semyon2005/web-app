from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from routers import users, regions, cities
import sqlite3
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(regions.router, prefix="/regions", tags=["Regions"])
app.include_router(cities.router, prefix="/cities", tags=["Cities"])


@app.get("/")
def read_root():
    pass
