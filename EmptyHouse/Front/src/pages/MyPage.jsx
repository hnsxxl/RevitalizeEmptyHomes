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
  useEffect(() => {
    const likedList = getLikedJobs();
    if (likedList.length === 0) {
      setLiked3dJobs([]);
      return;
    }
    fetch("http://localhost:8000/published_jobs")
      .then(res => res.json())
      .then(jobs => {
        const liked = jobs.filter(j => likedList.includes(String(j.id)));
        setLiked3dJobs(liked);
      });
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
        <h2>올린 매물</h2>
        {myJobs.length === 0 ? (
          <p>아직 등록한 작업(매물)이 없습니다.</p>
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

      {/* 3D 공개 찜 매물 */}
      <div className="mypage-liked">
        <h2>찜한 매물</h2>
        {liked3dJobs.length === 0 ? (
          <p className="mypage-empty">찜한 모델이 없습니다.</p>
        ) : (
          <div className="mypage-liked-grid">
            {liked3dJobs.map(job => (
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
                  src={job.image}
                  alt={job.title}
                  className="mypage-card-img"
                  style={{ width: "100%", height: "130px", objectFit: "cover" }}
                />
                <div style={{ padding: 10 }}>
                  <h3 style={{ fontWeight: 600 }}>{job.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#556" }}>
                    #{job.tags && job.tags.join(" #")}
                  </p>
                  <div style={{ color: "#3377ee", fontSize: 12 }}>{job.created_at}</div>
                </div>
              </div>
            ))}
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