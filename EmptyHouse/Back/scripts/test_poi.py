import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.poi_service import search_poi

lat = 35.9763
lng = 126.7155

for kw in ["마트", "가볼만한곳", "주차장"]:
    pois = search_poi(lat, lng, kw)
    print(f"\n📍 {kw} 결과:")
    for poi in pois:
        print(" -", poi)
