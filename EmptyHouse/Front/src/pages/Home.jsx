import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [publicJobs, setPublicJobs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 공개된 작업 가져오기 ---
  useEffect(() => {
    fetch("http://localhost:8000/published_jobs")
      .then(res => res.json())
      .then(setPublicJobs)
      .catch(console.error);
  }, []);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(publicJobs.length / itemsPerSlide);
  const visibleProperties = publicJobs.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if ((currentSlide + 1) * itemsPerSlide < publicJobs.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <div className="home-container">
      <section className="home-header">
        <div className="nav-links">
          <h1 className="site-title">빈집찾기</h1>
          {/* ... */}
        </div>
      </section>

      <section style={{ background: "#f0f0f0", height: "300px", marginBottom: "50px" }}>
        <h2 style={{ textAlign: "center", lineHeight: "300px" }}>사이트 소개 사진 자리</h2>
      </section>

      <section className="recommend-section" style={{ textAlign: "center" }}>
        <h2>추천 매물 (공개된 가우시안 모델!)</h2>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", marginTop: "20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)`,
            gap: "20px",
            width: "calc(1000px + 40px)",
            margin: "0 auto",
            position: "relative"
          }}>
            {visibleProperties.map(job => (
              <div
                key={job.id}
                onClick={() => navigate(`/detail/${job.id}`)}
                style={{
                  width: "250px", height: "300px", background: "#fff",
                  borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden", cursor: "pointer", flexShrink: 0,
                  transition: "transform 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <img
                  src={job.image}
                  alt="가우시안 3D 결과"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={e => {
                    if (!e.target._errored) {
                      e.target.src = "/noimage.png";
                      e.target._errored = true;
                    }
                  }}
                />
                <div style={{ padding: "10px" }}>
                  <h4>{job.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>
                    #{job.tags && job.tags.join(' #')}
                  </p>
                  <div style={{ color: "#3377ee", fontSize: 13 }}>{job.created_at}</div>
                </div>
              </div>
            ))}
          </div>
          {/* ...이하 생략... */}
        </div>
      </section>
    </div>
  );
}
export default Home;