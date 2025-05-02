import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';

function MyPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { favorites, properties } = useProperty();

  if (!isLoggedIn) {
    alert("로그인이 필요한 서비스입니다.");
    navigate('/login');
    return null;
  }

  const likedProperties = properties.filter(p => favorites.includes(p.id));

  // 가짜 유저 정보
  const user = {
    name: "홍길동",
    email: "gildong@example.com"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>마이페이지</h1>

      {/* 유저 정보 */}
      <div style={{ marginBottom: "40px" }}>
        <h2>내 정보</h2>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>
      </div>

      {/* 찜한 매물 */}
      <div>
        <h2>찜한 매물</h2>
        {likedProperties.length === 0 ? (
          <p style={{ color: "#888" }}>찜한 매물이 없습니다.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {likedProperties.map(property => (
              <div
                key={property.id}
                onClick={() => navigate(`/detail/${property.id}`)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#fafafa",
                  cursor: "pointer"
                }}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  style={{ width: "100%", height: "140px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>{property.title}</h3>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    #{property.tags.join(" #")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPage;
