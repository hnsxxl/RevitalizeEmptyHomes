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

  const { isLoggedIn } = useAuth();
  const { properties, favorites, toggleFavorite } = useProperty();

/*
  // ✅ Kakao 지도 생성
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=28cfa7959f3cd4e4af75479d4c01d7b9&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3
        };
        new window.kakao.maps.Map(mapContainer, options);
      });
    };

    document.head.appendChild(script);
  }, []);
*/

/*
useEffect(() => {
  const script = document.createElement('script');
  script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=28cfa7959f3cd4e4af75479d4c01d7b9&autoload=false";
  script.async = true;

  script.onload = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.9675, 126.7365), // 군산
        level: 5,
      };
      const map = new window.kakao.maps.Map(mapContainer, options);

      // 🔽 여기서 API 호출하고 마커 찍기
      fetch("http://localhost:8000/houses")
        .then((res) => res.json())
        .then((data) => {
          data.forEach((house) => {
            new window.kakao.maps.Marker({
              map: map,
              position: new window.kakao.maps.LatLng(house.lat, house.lng),
              title: house.address,
            });
          });
        })
        .catch((err) => console.error("지도 마커 불러오기 실패:", err));
    });
  };

  document.head.appendChild(script);
}, []);
*/

  // Kakao 지도 생성 + DB에서 핀 찍기
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=28cfa7959f3cd4e4af75479d4c01d7b9&autoload=false";
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(35.9675, 126.7365), // 군산 중심
          level: 5,
        };
        const map = new window.kakao.maps.Map(mapContainer, options);

        // DB에서 핀 정보 받아오기
        fetch("http://localhost:8000/houses")
          .then((res) => res.json())
          .then((data) => {
            // setHouses(data); // 혹시 나중에 검색/리스트에 활용할 수도 있으므로 저장

            data.forEach((house) => {
              new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(house.lat, house.lng),
                title: house.address,
              });
            });
          })
          .catch((err) => console.error("지도 마커 불러오기 실패:", err));
      });
    };

    document.head.appendChild(script);
  }, []);


  const handleSearchSubmit = () => setShowResults(true);
  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setRegion('');
    setShowResults(false);
  };
  const handleKeyDown = (e) => e.key === 'Enter' && handleSearchSubmit();

  const filtered = properties.filter((p) => {
    const matchesQuery = p.title.includes(searchQuery);
    const matchesCategory = category ? p.tags.includes(category) : true;
    const matchesRegion = region ? p.region === region : true;
    return matchesQuery && matchesCategory && matchesRegion;
  });

  return (
    <div className="find-property-container">
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요 (예: 지역명, 관광지)"
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

      {/* 지도 */}
      <div id="map" className="map-placeholder"></div>

      {/* 검색 결과 */}
      {showResults && (
        <div className="search-results">
          <h2>검색 결과</h2>
          {filtered.length > 0 ? (
            filtered.map((property) => (
              <div
                key={property.id}
                className="property-item"
                onClick={() => navigate(`/detail/${property.id}`)}
              >
                <div>
                  <h3>{property.title}</h3>
                  <p>#{property.tags.join(' #')}</p>
                </div>
                <button
                  className="property-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      alert('로그인이 필요한 기능입니다.');
                      navigate('/login');
                      return;
                    }
                    toggleFavorite(property.id);
                  }}
                >
                  {favorites.includes(property.id) ? (
                    <FaHeart color="red" size={20} />
                  ) : (
                    <FaRegHeart size={20} />
                  )}
                </button>
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
