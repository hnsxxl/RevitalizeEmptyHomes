import pandas as pd
import requests
import time
from tqdm import tqdm

KAKAO_API_KEY = '6a124338cc4002da1fd0cec0bf29eae8' 

def geocode(address):
    url = 'https://dapi.kakao.com/v2/local/search/address.json'
    headers = {'Authorization': f'KakaoAK {KAKAO_API_KEY}'}
    params = {'query': address}
    try:
        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        result = res.json()
        if result['documents']:
            x = result['documents'][0]['x']
            y = result['documents'][0]['y']
            return y, x
    except Exception as e:
        print(f'변환 실패: {address}, 이유: {e}')
    return None, None

# CSV 파일 불러오기
df = pd.read_csv('models/군산빈집.csv', encoding='cp949')
df['전체주소'] = df['도로명주소']

# 진행률 표시하며 위도/경도 붙이기
lat, lng = [], []
for addr in tqdm(df['전체주소']):
    y, x = geocode(addr)
    lat.append(y)
    lng.append(x)
    time.sleep(0.3)

df['위도'] = lat
df['경도'] = lng

# 변환 성공한 것만 남기기
df = df.dropna(subset=['위도', '경도'])

# 새 파일로 저장
df.to_csv('data/군산빈집_latlng.csv', index=False, encoding='utf-8-sig')
print("위도/경도 붙인 파일 저장 완료!")
