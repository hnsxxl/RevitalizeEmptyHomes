import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import './FindProperty.css';

function FindProperty() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [houses, setHouses] = useState([]);

  const { isLoggedIn } = useAuth();
  const { properties, favorites, toggleFavorite } = useProperty();

  // 지도 생성 및 빈집 데이터 fetch
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=28cfa7959f3cd4e4af75479d4c01d7b9&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(35.8460944271824, 127.13438887464724),
          level: 5,
        };
        const map = new window.kakao.maps.Map(mapContainer, options);
        window.customMap = map;

        fetch("http://localhost:8000/houses")
          .then((res) => res.json())
          .then((data) => setHouses(data))
          .catch((err) => console.error("빈집 데이터 불러오기 실패:", err));
      });
    };

    document.head.appendChild(script);
  }, []);

  const handleSearchSubmit = () => {
  setShowResults(true);

  if (window.searchMarkers) {
    window.searchMarkers.forEach(marker => marker.setMap(null));
  }

  const map = window.customMap;
  const query = searchQuery.toLowerCase();
  const regionQuery = region.toLowerCase();

  const matched = houses.filter((h) => {
    const addr = h.address?.toLowerCase() || '';
    const matchesQuery = query ? addr.includes(query) : true;
    const matchesCategory = category ? h.type?.includes(category) : true;
    const matchesRegion = region ? (
      addr.includes(regionQuery)
    ) : true;
    return matchesQuery && matchesCategory && matchesRegion;
  });

  const bounds = new window.kakao.maps.LatLngBounds(); // 범위 객체 생성

  const markers = matched.map((house) => {
    const position = new window.kakao.maps.LatLng(house.lat, house.lng);
    bounds.extend(position); // 범위 확장
    return new window.kakao.maps.Marker({
      map: map,
      position: position,
      title: house.address,
    });
  });

  if (matched.length > 0) {
    map.setBounds(bounds); // 마커 전체 포함되도록 지도 이동
  }

  window.searchMarkers = markers;
};

  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setRegion('');
    setShowResults(false);

    // 마커 제거
    if (window.searchMarkers) {
      window.searchMarkers.forEach(marker => marker.setMap(null));
      window.searchMarkers = [];
    }
  };

  const handleKeyDown = (e) => e.key === 'Enter' && handleSearchSubmit();

  return (
    <div className="find-property-container">
      <h2>빈집 지도</h2>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요 (예: 군산, 월명동)"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">용도 선택</option>
          <option value="주거용">주거용</option>
          <option value="상업용">상업용</option>
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">지역 선택</option>
          <option value="서울특별시">서울특별시</option>
          <option value="부산광역시">부산광역시</option>
          <option value="대구광역시">대구광역시</option>
          <option value="인천광역시">인천광역시</option>
          <option value="광주광역시">광주광역시</option>
          <option value="대전광역시">대전광역시</option>
          <option value="울산광역시">울산광역시</option>
          <option value="세종특별자치시">세종특별자치시</option>
          <option value="경기도">경기도</option>
          <option value="강원도">강원도</option>
          <option value="충청북도">충청북도</option>
          <option value="충청남도">충청남도</option>
          <option value="전라북도">전라북도</option>
          <option value="전라남도">전라남도</option>
          <option value="경상북도">경상북도</option>
          <option value="경상남도">경상남도</option>
          <option value="제주특별자치도">제주특별자치도</option>
        </select>
        <button onClick={handleSearchSubmit}>검색</button>
        <button onClick={handleReset}>초기화</button>
      </div>

      <div id="map" className="map-placeholder"></div>

      {showResults && (
        <div className="search-results">
          <h2>검색 결과</h2>
          {houses.filter((h) => h.address?.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
            houses
              .filter((h) => h.address?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((property, i) => (
                <div key={i} className="property-item">
                  <div>
                    <h3>{property.address}</h3>
                    <p>연면적: {property.area}㎡</p>
                  </div>
                </div>
              ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FindProperty;
