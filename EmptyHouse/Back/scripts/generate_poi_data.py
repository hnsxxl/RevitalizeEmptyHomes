import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
import time
from services.poi_service import search_poi
from tqdm import tqdm

df = pd.read_csv("data/군산빈집_latlng.csv")
df = df.rename(columns={"위도": "lat", "경도": "lng", "전체주소": "address"})

results = []

for i, row in tqdm(df.iterrows(), total=len(df), desc="빈집별 POI 수집 중"):
    lat = row["lat"]
    lng = row["lng"]
    house_id = i  # index 기반 ID

    house_pois = []
    for keyword in ["마트", "가볼만한곳", "주차장"]:
        pois = search_poi(lat, lng, keyword)
        for poi in pois:
            poi["house_id"] = house_id
            house_pois.append(poi)
        time.sleep(0.3)  # Kakao API rate limit 대응

    results.extend(house_pois)

# 데이터프레임으로 저장
poi_df = pd.DataFrame(results)
poi_df.to_csv("data/poi_by_house.csv", index=False, encoding="utf-8-sig")
print(f"POI 데이터 {len(poi_df)}건 저장 완료!")
