import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import './MyPage.css';

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

  const user = {
    name: "홍길동",
    email: "gildong@example.com"
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>

      <div className="mypage-user-info">
        <h2>내 정보</h2>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>
      </div>

      <div className="mypage-liked">
        <h2>찜한 매물</h2>
        {likedProperties.length === 0 ? (
          <p className="mypage-empty">찜한 매물이 없습니다.</p>
        ) : (
          <div className="mypage-liked-grid">
            {likedProperties.map(property => (
              <div
                key={property.id}
                className="mypage-card"
                onClick={() => navigate(`/detail/${property.id}`)}
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="mypage-card-img"
                />
                <div className="mypage-card-body">
                  <h3 className="mypage-card-title">{property.title}</h3>
                  <p className="mypage-card-tags">
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
