import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

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
    fetch("http://localhost:8000/published_jobs")
      .then(res => res.json())
      .then(jobs => {
        const found = jobs.find(j => String(j.id) === String(id));
        setJob(found || null);
      });
    setLiked(getLikedJobs().includes(String(id)));
  }, [id]);

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
        <h2 style={{ fontWeight: 600, marginBottom: 16 }}>3D 미리보기</h2>
        <iframe
          src={`http://localhost:7033/?file=${encodeURIComponent(job.image)}`}
          title="supersplat"
          width="100%"
          height="540"
          style={{ border: "2px solid #bcd", borderRadius: 18, background: "#222" }}
          allowFullScreen
        />
      </div>

      {/* 오른쪽 정보 */}
      <div style={{ flex: 1, background: "#fafaff", borderRadius: 18, boxShadow: "0 2px 18px #ccd3", padding: 28 }}>
        <h2>{job.title}</h2>
        <div style={{ margin: "18px 0", color: "#225", fontWeight: 500 }}>
          {job.tags && job.tags.map((tag, i) => (
            <span key={i} style={{
              display: "inline-block", background: "#dde6ff", color: "#256",
              fontSize: 13, padding: "4px 12px", borderRadius: 12, marginRight: 6
            }}>#{tag}</span>
          ))}
        </div>
        <div style={{ color: "#888", marginBottom: 10 }}>등록일: {job.created_at}</div>
        <div style={{ color: "#115", marginBottom: 10, fontWeight: 500 }}>상태: {job.status}</div>
        <button
          onClick={() => window.open(job.image, "_blank")}
          style={{
            background: "#3477ef", color: "#fff", border: "none",
            borderRadius: 7, padding: "9px 20px", fontWeight: 700, fontSize: 16,
            cursor: "pointer", marginTop: 12
          }}
        >
          3D 결과 파일 다운로드
        </button>
        {/* 찜 버튼 */}
        <button
          onClick={handleLike}
          style={{
            marginLeft: 20, fontSize: 16, padding: "8px 18px", borderRadius: 8,
            background: liked ? "#ff6f91" : "#eee", color: liked ? "#fff" : "#444", fontWeight: 600, border: "none", cursor: "pointer"
          }}
        >{liked ? "❤️ 찜 완료" : "🤍 찜하기"}</button>
        <div style={{ marginTop: 30, color: "#bbb", fontSize: 13 }}>
          ※ 본 데이터는 사용자 공개로 게시되었습니다.
        </div>
      </div>
    </div>
  );
}
export default DetailPage;