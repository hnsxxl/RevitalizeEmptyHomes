# Back/routes/house.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.db_house import House
from database import get_db

router = APIRouter()

@router.get("/houses")
def get_all_houses(db: Session = Depends(get_db)):
    houses = db.query(House).all()
    return [
        {
            "id": house.id,
            "address": house.address,
            "latitude": house.latitude,
            "longitude": house.longitude
        }
        for house in houses
    ]
