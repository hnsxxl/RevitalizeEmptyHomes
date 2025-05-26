import requests
from urllib.parse import quote

KAKAO_REST_API_KEY = "6a124338cc4002da1fd0cec0bf29eae8"

def geocode_address(address):
    url = f"https://dapi.kakao.com/v2/local/search/address.json?query={quote(address)}"
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        if result["documents"]:
            coords = result["documents"][0]["address"]
            return coords["y"], coords["x"]  # 위도, 경도
    return None, None