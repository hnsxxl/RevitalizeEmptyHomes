import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt, FaPhone } from 'react-icons/fa';

function DetailPage({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const property = {
    id,
    title: "해남군 빈집",
    description: {
      용도: "주거용",
      면적: "120㎡",
      층수: "2층",
      건축연도: "2001년",
      방향: "남향",
      주변관광지: "땅끝마을, 두륜산 국립공원"
    },
    문의전화: "063-270-2114"
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  };

  const handleCall = () => {
    window.location.href = `tel:${property.문의전화}`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", display: "flex", gap: "30px" }}>
      {/* 왼쪽: 3D 뷰 자리 */}
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
          (여기에 3D 뷰가 들어갈 예정입니다)
        </div>
      </div>

      {/* 오른쪽: 상세정보 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>{property.title}</h1>

        <div style={{ fontSize: "18px", lineHeight: "1.8" }}>
          {Object.entries(property.description).map(([key, value]) => (
            <div key={key}><strong>{key}</strong>: {value}</div>
          ))}
        </div>

        {/* 버튼들 */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button
            onClick={handleLike}
            style={{
              border: "1px solid #ccc",
              borderRadius: "50%",
              padding: "15px",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            {liked ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
          </button>

          <button
            onClick={handleShare}
            style={{
              border: "1px solid #ccc",
              borderRadius: "50%",
              padding: "15px",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            <FaShareAlt size={24} />
          </button>

          <button
            onClick={handleCall}
            style={{
              border: "1px solid #ccc",
              borderRadius: "50%",
              padding: "15px",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            <FaPhone size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
