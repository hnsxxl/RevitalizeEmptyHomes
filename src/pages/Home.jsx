import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const sampleProperties = [
  { id: 1, title: "해남군 빈집", tags: ["주거용", "자연속"] },
  { id: 2, title: "포항시 소형주택", tags: ["주거용", "리모델링"] },
  { id: 3, title: "제주시 상가건물", tags: ["상업용", "관광지 근처"] },
  { id: 4, title: "강릉시 바닷가 빈집", tags: ["주거용", "바닷가"] },
  { id: 5, title: "서울시 빈집", tags: ["주거용", "편의시설"] },
  { id: 6, title: "광주 주택", tags: ["주거용", "교통 편리"] },
  { id: 7, title: "부산 상가", tags: ["상업용", "도심 근처"] },
  { id: 8, title: "춘천 전원주택", tags: ["주거용", "자연환경"] },
];

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = Math.ceil(sampleProperties.length / 4);

  const visibleProperties = sampleProperties.slice(currentSlide * 4, currentSlide * 4 + 4);

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if ((currentSlide + 1) * 4 < sampleProperties.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <section style={{ marginBottom: "40px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>빈집찾기</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
          <Link to="/find-property">매물찾기</Link>
          <Link to="/register-property">매도의뢰</Link>
        </div>
      </section>

      <section style={{ background: "#f0f0f0", height: "300px", marginBottom: "50px" }}>
        <h2 style={{ textAlign: "center", lineHeight: "300px" }}>사이트 소개 사진 자리</h2>
      </section>

      <section style={{ textAlign: "center" }}>
        <h2>추천 매물</h2>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", marginTop: "20px" }}>
          <div style={{
            display: "flex",
            gap: "20px",
            transform: `translateX(-${currentSlide * 1100}px)`,
            transition: "transform 0.6s ease",
          }}>
            {visibleProperties.map(property => (
              <div
                key={property.id}
                onClick={() => navigate(`/detail/${property.id}`)}
                style={{
                  width: "250px",
                  height: "300px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <img src="/default-house.png" alt="빈집" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <div style={{ padding: "10px" }}>
                  <h4>{property.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>#{property.tags.join(' #')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 화살표 */}
          {sampleProperties.length > 4 && currentSlide > 0 && (
            <button onClick={handlePrev} style={arrowStyle("left")}>◀</button>
          )}
          {sampleProperties.length > 4 && currentSlide < totalSlides - 1 && (
            <button onClick={handleNext} style={arrowStyle("right")}>▶</button>
          )}
        </div>
      </section>
    </div>
  );
}

function arrowStyle(direction) {
  return {
    position: "absolute",
    top: "50%",
    [direction]: "-20px",
    transform: "translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "2px solid black",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  };
}

export default Home;
