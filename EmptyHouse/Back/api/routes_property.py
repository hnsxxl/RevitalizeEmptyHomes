from fastapi import APIRouter
import pandas as pd
import math
from services.geocoding_service import geocode_address

router = APIRouter()

@router.get("/houses")
def get_houses():
    df = pd.read_csv("models/군산시_빈집데이터.csv", encoding="cp949")
    results = []

    for _, row in df.iterrows():
        address = row["도로명주소"]
        lat, lng = geocode_address(address)

        # None, '', NaN, 변환 실패 등 다 걸러냄
        if not lat or not lng:
            continue

        try:
            lat_f = float(lat)
            lng_f = float(lng)

            # float 변환은 되었지만, 여전히 NaN인 경우
            if math.isnan(lat_f) or math.isnan(lng_f):
                continue

            results.append({
                "address": address,
                "lat": round(lat_f, 7),  # 소수점 제한도 안전
                "lng": round(lng_f, 7),
                "area": float(row["연면적(제곱미터)"]) if not pd.isna(row["연면적(제곱미터)"]) else None
            })

        except (ValueError, TypeError):
            continue

    return results
