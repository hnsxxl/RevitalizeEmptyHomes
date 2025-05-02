import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt, FaPhone } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';

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
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", display: "flex", gap: "30px" }}>
      <div style={{ flex: 1 }}>
        <div style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "#666"
        }}>
          (여기에 3D 뷰 자리)
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "28px" }}>{property.title}</h1>

        <div style={{ fontSize: "18px", lineHeight: "1.8" }}>
          {property.tags && property.tags.map((tag, i) => (
            <div key={i}>• {tag}</div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button onClick={handleLike} style={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            padding: "15px",
            backgroundColor: "white",
            cursor: "pointer"
          }}>
            {liked ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
          </button>

          <button onClick={handleShare} style={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            padding: "15px",
            backgroundColor: "white",
            cursor: "pointer"
          }}>
            <FaShareAlt size={24} />
          </button>

          <button onClick={handleCall} style={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            padding: "15px",
            backgroundColor: "white",
            cursor: "pointer"
          }}>
            <FaPhone size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
