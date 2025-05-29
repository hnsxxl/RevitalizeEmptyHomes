import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import pandas as pd
from sqlalchemy.orm import Session
from database import engine, get_db
from models.db_house import House

# CSV 경로
CSV_PATH = "./data/군산빈집_latlng.csv"

def insert_data():
    df = pd.read_csv(CSV_PATH, encoding='utf-8')
    db: Session = next(get_db())

    for _, row in df.iterrows():
        house = House(
            address=row["전체주소"],
            latitude=row["위도"],
            longitude=row["경도"]
        )
        db.add(house)

    db.commit()
    print("데이터 삽입 완료!")

if __name__ == "__main__":
    insert_data()
