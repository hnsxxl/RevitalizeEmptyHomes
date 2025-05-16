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
    alert('로그인이 필요한 서비스입니다.');
    navigate('/login');
    return null;
  }

  const likedProperties = properties.filter(p => favorites.includes(p.id));

  const user = {
    name: '홍길동',
    email: 'gildong@example.com',
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>

      <div className="mypage-section">
        <h2 className="mypage-subtitle">내 정보</h2>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>
      </div>

      <div className="mypage-section">
        <h2 className="mypage-subtitle">찜한 매물</h2>
        {likedProperties.length === 0 ? (
          <p className="mypage-empty">찜한 매물이 없습니다.</p>
        ) : (
          likedProperties.map(property => (
            <div key={property.id}>
              <p>{property.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPage;
