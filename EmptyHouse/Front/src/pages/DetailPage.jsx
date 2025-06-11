import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

const dummy = {
  id: 114,
  title: "전라북도 군산시 개복길 28",
  tags: ["개복복동", "주거용"],
  created_at: "2025-06-01",
  image: "http://localhost:52928/example.splat",
  latitude: 35.9839648240786,
  longitude: 126.714413468151,
};



function getLikedJobs() {
  return JSON.parse(localStorage.getItem('liked3dJobs') || "[]");
}
function setLikedJobs(list) {
  localStorage.setItem('liked3dJobs', JSON.stringify(list));
}

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (String(id) === "114") {
      setJob(dummy);  // 👈 dummy 강제 적용
      return;
    }

    fetch("http://localhost:8000/houses")
      .then(res => res.json())
      .then(jobs => {
        const found = jobs.find(j => String(j.id) === String(id));
        setJob(found || null);
      });

    setLiked(getLikedJobs().includes(String(id)));
  }, [id]);

  useEffect(() => {
    if (!job || !window.kakao?.maps) return;

    const container = document.getElementById("detail-map");
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(job.latitude, job.longitude),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(job.latitude, job.longitude),
      title: job.title,
    });
  }, [job]);


  function handleLike() {
    let likedList = getLikedJobs();
    if (likedList.includes(String(id))) {
      likedList = likedList.filter(jid => jid !== String(id));
    } else {
      likedList.push(String(id));
    }
    setLikedJobs(likedList);
    setLiked(likedList.includes(String(id)));
  }

  if (!job) return <div style={{ padding: '20px' }}>해당 매물을 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32 }}>
      {/* 왼쪽 3D Supersplat */}
      <div style={{ flex: 2 }}>
        <h2 style={{ fontWeight: 600, marginBottom: 16 }}> 빈집 미리보기</h2>
        <iframe
          src={`http://localhost:52928/?file=${encodeURIComponent(job.image)}`}
          title="supersplat"
          width="100%"
          height="540"
          style={{ border: "2px solid #bcd", borderRadius: 18, background: "#222" }}
          allowFullScreen
        />
      </div>

      {/* 오른쪽 정보 */}
      <div style={{ flex: 1, background: "#fafaff", borderRadius: 18, boxShadow: "0 2px 18px #ccd3", padding: 28 }}>
        <h2 style={{ fontSize: "30px", fontWeight: "700", marginBottom: "12px" }}>
          {job.title}
        </h2>

        <div style={{ margin: "25px 0", color: "#225", fontWeight: 500 }}>
          {job.tags && job.tags.map((tag, i) => (
            <span key={i} style={{
              display: "inline-block", background: "#dde6ff", color: "#256",
              fontSize: 15, padding: "4px 12px", borderRadius: 12, marginRight: 6
            }}>#{tag}</span>
          ))}
        </div>

        <div style={{ color: "#888", marginBottom: 10 }}>등록일: {job.created_at}</div>
        
        <button
          onClick={() => alert("문의 기능은 준비 중입니다.")}
          style={{
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: 7, padding: "9px 20px", fontWeight: 700, fontSize: 16,
            cursor: "pointer", marginTop: 12
          }}
        >
          문의하기
        </button>
        {/* 찜 버튼 */}
        <button
          onClick={handleLike}
          style={{
            marginLeft: 20, fontSize: 16, padding: "8px 18px", borderRadius: 8,
            background: liked ? "#ff6f91" : "#eee", color: liked ? "#fff" : "#444", fontWeight: 600, border: "none", cursor: "pointer"
          }}
        >{liked ? "❤️ 찜 완료" : "🤍 찜하기"}</button>

        <div
          id="detail-map"
          style={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            marginTop: '20px'
          }}
        ></div>

      </div>
    </div>
  );
}
export default DetailPage;