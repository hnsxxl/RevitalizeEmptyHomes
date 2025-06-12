import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProperty } from '../contexts/PropertyContext';
import JobDetailSplit from './JobDetailSplit'; // Split 컴포넌트 import
import './MyPage.css';

// 공개 3D 찜 helper
function getLikedJobs() {
  return JSON.parse(localStorage.getItem('liked3dJobs') || "[]");
}

function MyPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { favorites, properties } = useProperty();
  const [myJobs, setMyJobs] = useState([]);
  const [showSplit, setShowSplit] = useState(false);
  const [selectedJobUuid, setSelectedJobUuid] = useState(null);
  const [liked3dJobs, setLiked3dJobs] = useState([]);
  const [houseData, setHouseData] = useState([]);

  const imageMap = {
    "114": "/images/gaebok28.jpg",
    "30": "/images/changseong3.jpg",
    "202": "/images/sinhung.jpg",
    "203": "/images/sinchang.jpg"
  };

  // 내 작업 목록
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:8000/my_jobs/${user.email}`)
        .then(res => res.json())
        .then(data => setMyJobs(Array.isArray(data) ? data : []))
        .catch(err => {
          setMyJobs([]);
          console.error(err);
        });
    }
  }, [user]);

  // 공개 3D 찜 목록
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const likedList = getLikedJobs();
    if (likedList.length === 0) {
      setLiked3dJobs([]);
      return;
    }

    fetch("http://localhost:8000/houses")
      .then(res => res.json())
      .then(data => {
        setHouseData(data);  // 전체 데이터 저장
        const liked = data.filter(h => likedList.includes(String(h.id)));
        setLiked3dJobs(liked);  // 필터링된 찜 목록만 set
      })
      .catch(err => {
        console.error("빈집 데이터 불러오기 실패:", err);
      });
  }, [refresh]);

  // 새로운 useEffect 추가 (storage 이벤트 감지용)
  useEffect(() => {
    const sync = () => setRefresh(r => r + 1);  // refresh 증가 = 리렌더 유도
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);


  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const likedProperties = properties.filter(p => favorites.includes(p.id));

  if (!user) {
    return <div className="mypage-container">유저 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>

      <div className="mypage-user-info">
        <h2>로그인 정보</h2>
        <p><strong>이메일:</strong> {user.email}</p>
      </div>

      <div className="mypage-myhome">
        <h2>올린 빈집</h2>
        {myJobs.length === 0 ? (
          <p>아직 등록한 작업(빈집)이 없습니다.</p>
        ) : (
          <ul>
            {myJobs.map(job => (
              <li
                key={job.job_uuid}
                style={{ marginBottom: "12px", border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}
              >
                <div><strong>작업번호:</strong> {job.job_uuid}</div>
                <div><strong>생성일:</strong> {job.created_at}</div>
                <div><strong>상태:</strong> {job.status}</div>
                {job.result_path ? (
                  <span style={{ color: "#339" }}>결과 파일 있음</span>
                ) : (
                  <span style={{ color: "#aaa" }}>결과 파일 없음</span>
                )}
                {/* 바로가기 버튼 */}
                <button
                  style={{
                    marginLeft: 14,
                    background: "#3477ef", color: "#fff", border: "none",
                    borderRadius: 6, padding: "4px 16px", fontWeight: 600, cursor: "pointer"
                  }}
                  onClick={() => {
                    setSelectedJobUuid(job.job_uuid);
                    setShowSplit(true);
                  }}
                >바로가기</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3D 공개 찜 빈집 */}
      <div className="mypage-liked">
        <h2>찜한 빈집</h2>
        {liked3dJobs.length === 0 ? (
          <p className="mypage-empty">찜한 모델이 없습니다.</p>
        ) : (
          <div className="mypage-liked-grid">
            {liked3dJobs.map(job => {
              const thumbSrc = imageMap[String(job.id)] || "/default-house.png"; // ✅ 썸네일 결정

              return (
                <div
                  key={job.id}
                  className="mypage-card"
                  onClick={() => window.open(`/detail/${job.id}`, "_blank")}
                  style={{
                    background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e2e6f1",
                    overflow: "hidden", cursor: "pointer"
                  }}
                >
                  <img
                    src={thumbSrc} // ✅ 썸네일 적용
                    alt={job.title}
                    className="mypage-card-img"
                    style={{ width: "100%", height: "130px", objectFit: "cover" }}
                  />
                  <div style={{ padding: 10 }}>
                    <h3 style={{ fontWeight: 600 }}>{job.address || "주소 없음"}</h3>
                    {job.tags && <p style={{ fontSize: "0.85rem", color: "#556" }}>#{job.tags.join(" #")}</p>}
                    <div style={{ color: "#3377ee", fontSize: 12 }}>{job.created_at || ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 모달(작업 상세) */}
      {showSplit && (
        <div
          style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.23)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{
            width: "90vw", height: "90vh", background: "#fff", borderRadius: 14,
            boxShadow: "0 8px 32px #8888", overflow: "hidden", display: "flex"
          }}>
            <JobDetailSplit
              userEmail={user.email}
              initialJobUuid={selectedJobUuid}
              jobs={myJobs}
              onClose={() => setShowSplit(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;