import requests

KAKAO_API_KEY = "6a124338cc4002da1fd0cec0bf29eae8"

def search_poi(lat, lng, keyword, radius=2000):
    url = "https://dapi.kakao.com/v2/local/search/keyword.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    params = {
        "query": keyword,
        "x": lng,
        "y": lat,
        "radius": radius,
        "size": 15
    }
    res = requests.get(url, headers=headers, params=params)
    if res.status_code != 200:
        print(f"[{keyword}] 검색 실패 - status {res.status_code}")
        return []

    result = res.json()
    return [{
        "name": doc["place_name"],
        "category": keyword,
        "lat": float(doc["y"]),
        "lng": float(doc["x"]),
        "distance": int(doc.get("distance", 0))
    } for doc in result["documents"]]
