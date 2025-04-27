
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FindProperty() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();

  const properties = [
    { id: 1, title: "포항시 빈집", tags: ["주거용", "리모델링 가능"], image: "https://via.placeholder.com/300x200" },
    { id: 2, title: "해남군 빈집", tags: ["전원주택", "자연속", "주거용"], image: "https://via.placeholder.com/300x200" },
    { id: 3, title: "제주시 상가건물", tags: ["상업용", "관광지근처"], image: "https://via.placeholder.com/300x200" },
    { id: 4, title: "강릉시 빈집", tags: ["주거용", "바닷가"], image: "https://via.placeholder.com/300x200" }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchSubmit = () => {
    const keyword = searchQuery.trim().toLowerCase();

    const result = properties.filter((property) => {
      const titleMatch = property.title.toLowerCase().includes(keyword);
      const tagsMatch = property.tags.some(tag => tag.toLowerCase().includes(keyword));
      const categoryMatch = category ? property.tags.includes(category) : true;
      return (titleMatch || tagsMatch) && categoryMatch;
    });

    setFilteredProperties(result);
    setShowResults(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategory('');
    setShowResults(false);
    setFilteredProperties([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 지도 영역 */}
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

      {/* 검색창 영역 */}
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
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력하세요 (예: 지역명, 관광지)"
          style={{ flex: 2, padding: "10px", fontSize: "1rem" }}
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          style={{ flex: 1, padding: "10px", fontSize: "1rem" }}
        >
          <option value="">용도 선택</option>
          <option value="주거용">주거용</option>
          <option value="상업용">상업용</option>
          <option value="기타">기타</option>
        </select>
        <button onClick={handleSearchSubmit} style={{ padding: "10px 20px", fontSize: "1rem" }}>
          검색
        </button>
        <button onClick={handleReset} style={{ padding: "10px 20px", fontSize: "1rem" }}>
          초기화
        </button>
      </div>

      {/* 검색 결과 리스트 */}
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
          {filteredProperties.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/detail/${property.id}`)}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer"
                  }}
                >
                  <img src={property.image} alt="대표 사진" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }} />
                  <h3>{property.title}</h3>
                  <p>#{property.tags.join(' #')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#888" }}>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FindProperty;
