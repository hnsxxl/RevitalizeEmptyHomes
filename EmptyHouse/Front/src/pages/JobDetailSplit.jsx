import React, { useEffect, useState } from 'react';

function JobDetailSplit({ userEmail, initialJobUuid, jobs: propJobs, onClose }) {
  const [jobs, setJobs] = useState(propJobs || []);
  const [selectedJob, setSelectedJob] = useState(null);
  const [supersplatUrl, setSupersplatUrl] = useState("http://localhost:65255/");
  const [publishLoading, setPublishLoading] = useState(null);

  // propJobs로 올 때는 fetch 안 해도 됨!
  useEffect(() => {
    if (!propJobs && userEmail) {
      fetch(`http://localhost:8000/my_jobs/${userEmail}`)
        .then(res => res.json())
        .then(setJobs)
        .catch(console.error);
    }
  }, [userEmail, propJobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      const initialJob = initialJobUuid
        ? jobs.find(job => job.job_uuid === initialJobUuid)
        : jobs[0];
      setSelectedJob(initialJob);
      if (initialJob?.result_path) {
        setSupersplatUrl(
          `http://localhost:65255/?file=${encodeURIComponent(
            `http://localhost:8000/outputs_download/${initialJob.result_path.replace(/^outputs[\\/]+/, '')}`
          )}&ts=${Date.now()}`
        );
      }
    }
  }, [jobs, initialJobUuid]);

  function handleJobSelect(job) {
    setSelectedJob(job);
    if (job?.result_path) {
      setSupersplatUrl(
        `http://localhost:65255/?file=${encodeURIComponent(
          `http://localhost:8000/outputs_download/${job.result_path.replace(/^outputs[\\/]+/, '')}`
        )}&ts=${Date.now()}`
      );
    }
  }

  // "웹에 올리기" 버튼 클릭 핸들러
  async function handlePublish(job_uuid) {
    setPublishLoading(job_uuid);
    try {
      await fetch(`http://localhost:8000/publish_job/${job_uuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      // jobs 리스트에서 해당 job을 is_published=true로 변경(낙관적 업데이트)
      setJobs(jobs => jobs.map(j =>
        j.job_uuid === job_uuid ? { ...j, is_published: true } : j
      ));
      alert("메인페이지에 공개되었습니다!");
    } catch (e) {
      alert("공개 처리에 실패했습니다.");
    }
    setPublishLoading(null);
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* 왼쪽 Supersplat */}
      <div style={{ flex: 2, borderRight: "1.5px solid #eee", background: "#222" }}>
        <iframe
          src={supersplatUrl}
          title="supersplat"
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "600px", background: "#222" }}
          allowFullScreen
        />
      </div>
      {/* 오른쪽 작업 목록 */}
      <div style={{
        flex: 1, overflowY: "auto", padding: 36, background: "#fff",
        display: "flex", flexDirection: "column", justifyContent: "flex-start"
      }}>
        <div style={{ fontWeight: 700, fontSize: 26, marginBottom: 28 }}>내가 올린 작업 목록</div>
        {jobs.length === 0 ? (
          <div>아직 작업이 없습니다.</div>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {jobs.map(job => (
              <li
                key={job.job_uuid}
                style={{
                  padding: "18px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  marginBottom: 16,
                  background: job.job_uuid === selectedJob?.job_uuid ? "#e6f1ff" : "#fafbfc",
                  cursor: "pointer"
                }}
                onClick={() => handleJobSelect(job)}
              >
                <div><b>작업번호:</b> {job.job_uuid}</div>
                <div><b>생성일:</b> {job.created_at}</div>
                <div><b>상태:</b> {job.status}</div>
                {job.result_path && (
                  <>
                    <a
                      href={`http://localhost:8000/outputs_download/${job.result_path.replace(/^outputs[\\/]+/, '')}`}
                      download
                      style={{
                        display: "inline-block",
                        marginTop: 8,
                        color: "#3377ee",
                        fontWeight: 600,
                        textDecoration: "underline",
                        borderRadius: 5,
                        fontSize: 15,
                        background: "#eef",
                        padding: "3px 9px"
                      }}
                      onClick={e => e.stopPropagation()}
                    >PLY 다운로드</a>
                    {/* "웹에 올리기" 버튼 */}
                    <button
                      style={{
                        marginLeft: 10, marginTop: 8,
                        background: job.is_published ? "#888" : "#22c55e",
                        color: "#fff", border: "none",
                        borderRadius: 5, padding: "3px 10px",
                        fontWeight: 500, cursor: job.is_published ? "not-allowed" : "pointer"
                      }}
                      disabled={job.is_published || publishLoading === job.job_uuid}
                      onClick={e => {
                        e.stopPropagation();
                        if (!job.is_published) handlePublish(job.job_uuid);
                      }}
                    >
                      {job.is_published ? "이미 공개됨" : (publishLoading === job.job_uuid ? "올리는 중..." : "웹페이지에 올리기")}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} style={{
          marginTop: "auto", background: "#eee", border: "none",
          borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 18, cursor: "pointer"
        }}>닫기</button>
      </div>
    </div>
  );
}

export default JobDetailSplit;