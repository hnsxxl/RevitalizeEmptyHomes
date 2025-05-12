import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { properties } = useProperty();
  const [currentSlide, setCurrentSlide] = useState(0);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(properties.length / itemsPerSlide);
  const visibleProperties = properties.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if ((currentSlide + 1) * itemsPerSlide < properties.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="home-container">
      <section className="home-header">
        <div className="nav-links">
          <h1 className="site-title">빈집찾기</h1>
          <Link to="/find-property" className="link-find">매물찾기</Link>
          <Link to="/register-property" className="link-register">매도의뢰</Link>
        </div>
      </section>

      <section style={{ background: "#f0f0f0", height: "300px", marginBottom: "50px" }}>
        <h2 style={{ textAlign: "center", lineHeight: "300px" }}>사이트 소개 사진 자리</h2>
      </section>

      <section className="recommend-section" style={{ textAlign: "center" }}>
        <h2>추천 매물</h2>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", marginTop: "20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)`,
            gap: "20px",
            width: "calc(1000px + 40px)",
            margin: "0 auto",
            position: "relative"
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
                <img src={property.image} alt="빈집" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <div style={{ padding: "10px" }}>
                  <h4>{property.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>#{property.tags.join(' #')}</p>
                </div>
              </div>
            ))}
          </div>

          {properties.length > itemsPerSlide && currentSlide > 0 && (
            <button className="arrow-btn left" onClick={handlePrev}>◀</button>
          )}
          {properties.length > itemsPerSlide && currentSlide < totalSlides - 1 && (
            <button className="arrow-btn right" onClick={handleNext}>▶</button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;