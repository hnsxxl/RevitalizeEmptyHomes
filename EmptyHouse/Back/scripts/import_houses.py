import pandas as pd
from sqlalchemy.orm import Session
from database import engine
from models.db_house import House  # House 모델 import

# CSV 파일 경로
CSV_FILE = "data/군산빈집_latlng.csv"

# 데이터베이스 세션 생성
session = Session(bind=engine)

# CSV 읽기
df = pd.read_csv(CSV_FILE, encoding='cp949')

# 데이터 삽입
for _, row in df.iterrows():
    if pd.isna(row["위도"]) or pd.isna(row["경도"]):
        continue  # 위도 경도 없는 행은 제외

    house = House(
        road_address=row["도로명주소"],
        latitude=row["위도"],
        longitude=row["경도"]
    )
    session.add(house)

# 커밋 및 세션 종료
session.commit()
session.close()

print("DB에 군산 빈집 데이터가 성공적으로 삽입되었습니다.")
