import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt, FaPhone } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import './DetailPage.css'; 

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { properties, favorites, toggleFavorite } = useProperty();

  const property = properties.find(p => p.id === Number(id));

  if (!property) {
    return <div style={{ padding: '20px' }}>해당 매물을 찾을 수 없습니다.</div>;
  }

  const liked = favorites.includes(property.id);

  const handleLike = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      navigate('/login');
      return;
    }
    toggleFavorite(property.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleCall = () => {
    window.location.href = `tel:${property.문의전화 || '063-000-0000'}`;
  };

  return (
    <>
      <div className="detail-header">
        <h2 className="detail-heading">매물 찾기</h2>
        <hr className="detail-divider" />
      </div>

      <div className="detail-container">
        <div className="detail-left">
          <div className="detail-3d-view">
            (여기에 3D 뷰 자리)
          </div>
        </div>

        <div className="detail-right">
          <h1 className="detail-title">{property.title}</h1>

          <div className="detail-tags">
            {property.tags && property.tags.map((tag, i) => (
              <div key={i}>• {tag}</div>
            ))}
          </div>

          <div className="detail-buttons">
            <button onClick={handleLike} className="detail-button">
              {liked ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
            </button>

            <button onClick={handleShare} className="detail-button">
              <FaShareAlt size={24} />
            </button>

            <button onClick={handleCall} className="detail-button">
              <FaPhone size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailPage;