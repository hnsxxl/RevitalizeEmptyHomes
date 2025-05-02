import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';

function FindProperty() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { isLoggedIn } = useAuth();
  const { properties, favorites, toggleFavorite } = useProperty();

  const handleSearchSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setRegion('');
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const filtered = properties.filter((p) => {
    const matchesQuery = p.title.includes(searchQuery);
    const matchesCategory = category ? p.tags.includes(category) : true;
    const matchesRegion = region ? p.region === region : true;
    return matchesQuery && matchesCategory && matchesRegion;
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 지도 자리 */}
      <div style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#eee",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
      }}>
        <p style={{ textAlign: "center", lineHeight: "100vh", color: "#aaa" }}>
          (여기에 전국 지도 표시 예정)
        </p>
      </div>

      {/* 검색창 */}
      <div style={{
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        display: "flex",
        gap: "10px",
        zIndex: 3,
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요 (예: 지역명, 관광지)"
          style={{ flex: 2, padding: "10px", fontSize: "1rem" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ flex: 1, padding: "10px", fontSize: "1rem" }}
        >
          <option value="">용도 선택</option>
          <option value="주거용">주거용</option>
          <option value="상업용">상업용</option>
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{ flex: 1, padding: "10px", fontSize: "1rem" }}
        >
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
        <button onClick={handleSearchSubmit} style={{ padding: "10px 20px" }}>검색</button>
        <button onClick={handleReset} style={{ padding: "10px 20px" }}>초기화</button>
      </div>

      {/* 검색 결과 */}
      {showResults && (
        <div style={{
          position: "absolute",
          top: "100px",
          left: "20px",
          width: "300px",
          height: "calc(100vh - 140px)",
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 2,
        }}>
          <h2>검색 결과</h2>
          {filtered.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filtered.map((property) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/detail/${property.id}`)}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h3>{property.title}</h3>
                    <p>#{property.tags.join(' #')}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        alert("로그인이 필요한 기능입니다.");
                        navigate("/login");
                        return;
                      }
                      toggleFavorite(property.id);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "white",
                      cursor: "pointer"
                    }}
                  >
                    {favorites.includes(property.id)
                      ? <FaHeart color="red" size={20} />
                      : <FaRegHeart size={20} />}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FindProperty;
