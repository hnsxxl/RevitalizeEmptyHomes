// Home.jsx 추천 매물에서 dummyList 연결
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const dummyList = [
  {
    id: 114,
    title: "전라북도 군산시 개복길 28",
    tags: ["개복동", "주거용"],
    created_at: "2025-06-01",
    image: "/images/gaebok28.jpg",
  },
  {
    id: 201,
    title: "전라북도 군산시 창성3길 8-2",
    tags: ["개복동", "주거용"],
    created_at: "2025-06-12",
    image: "/images/changseong3.jpg",
  },
  {
    id: 202,
    title: "전라북도 군산시 신흥1길 5-9",
    tags: ["신흥동", "상업용"],
    created_at: "2025-06-12",
    image: "/images/sinhung.jpg",
  },
  {
    id: 203,
    title: "전라북도 군산시 신창로19번길 11-4",
    tags: ["금광동", "주거용"],
    created_at: "2025-06-12",
    image: "/images/sinchang.jpg",
  },
];

function Home() {
  const navigate = useNavigate();
  const [publicJobs, setPublicJobs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setPublicJobs(dummyList); // 👈 dummy 데이터 사용
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
      <img
        src="/images/site-intro.png"
        alt="사이트 소개"
        style={{
          width: '90%',
          maxWidth: '1200px',
          height: 'auto',
          display: 'block',
          margin: '40px auto',
          borderRadius: '12px',
        }}
      />

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
        </div>
      </section>
    </div>
  );
}

export default Home;
