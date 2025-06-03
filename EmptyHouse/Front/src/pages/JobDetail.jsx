import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function JobDetail() {
  const { job_uuid } = useParams();
  const [job, setJob] = useState(null);
  const [supersplatUrl, setSupersplatUrl] = useState("http://localhost:7033/");
  const dragRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:8000/job_detail/${job_uuid}`)
      .then(res => {
        if (!res.ok) throw new Error('작업을 찾을 수 없습니다.');
        return res.json();
      })
      .then(setJob)
      .catch(() => setJob(null));
  }, [job_uuid]);

  if (!job) return <div>불러오는 중...</div>;

  // 다운로드용 URL
  const plyUrl = job.result_path
    ? `http://localhost:8000/outputs_download/${job.result_path.replace(/^outputs[\\/]+/, '')}`
    : null;

  // Supersplat에 넘길 URL
  const supersplatFileUrl = plyUrl ? plyUrl : "";

  // 드래그 이벤트 설정
  function onDragStart(e) {
    // 브라우저에서 url drag를 지원하게
    e.dataTransfer.setData("text/uri-list", supersplatFileUrl);
    // 시각적 효과용 커스텀 drag image
    if (dragRef.current) {
      e.dataTransfer.setDragImage(dragRef.current, 0, 0);
    }
  }

  // 파란 블록 클릭하면 Supersplat iframe 새로고침 + 파일 URL 자동전달!
  function handleSupersplatBlockClick() {
    if (supersplatFileUrl) {
      setSupersplatUrl(
        `http://localhost:7033/?file=${encodeURIComponent(supersplatFileUrl)}&ts=${Date.now()}`
      );
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>작업 상세</h1>
      <div><strong>작업번호:</strong> {job.job_uuid}</div>
      <div><strong>생성일:</strong> {job.created_at}</div>
      <div><strong>상태:</strong> {job.status}</div>
      <div>
        <strong>결과 파일:</strong>
        {plyUrl ? (
          <>
            <a
              href={plyUrl}
              download
              style={{
                marginLeft: 12,
                color: '#339',
                fontWeight: 600,
                textDecoration: "underline",
                fontSize: 16,
                padding: "4px 8px",
                borderRadius: 8,
                background: "#eef"
              }}
            >
              PLY 파일 다운로드
            </a>
            {/* 드래그 & 클릭용 블록 */}
            <span
              ref={dragRef}
              draggable
              onDragStart={onDragStart}
              onClick={handleSupersplatBlockClick}
              title="Supersplat에 드래그&드롭 or 클릭!"
              style={{
                marginLeft: 18,
                display: "inline-block",
                width: 42, height: 42,
                background: "#05a",
                borderRadius: 12,
                color: "#fff",
                textAlign: "center",
                lineHeight: "42px",
                fontSize: 20,
                fontWeight: "bold",
                cursor: "grab",
                boxShadow: "0 2px 8px #0093bb44",
                userSelect: "none"
              }}
            >🟦</span>
          </>
        ) : (
          <span style={{ marginLeft: 12, color: '#aaa' }}>아직 없음</span>
        )}
      </div>

      {/* Supersplat iframe */}
      <div style={{ marginTop: 36, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 500, color: "#444" }}>SuperSplat 3D 뷰어</h3>
        <iframe
          src={supersplatUrl}
          title="supersplat"
          width={1000}
          height={600}
          style={{ border: "2px solid #aaf", borderRadius: 14, background: "#222" }}
          allowFullScreen
        />
        <div style={{
          marginTop: 16,
          color: "#444",
          fontSize: 16,
          fontWeight: 500,
          background: "#e8f0ff",
          borderRadius: 8,
          padding: 12,
          textAlign: "center",
          letterSpacing: "0.5px"
        }}>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;