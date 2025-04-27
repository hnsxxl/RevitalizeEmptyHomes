import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage({ isLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인 상태가 false일 때만 navigate 실행
      alert('로그인이 필요합니다.');
      navigate('/login', { replace: true }); // ✅ replace 옵션 추가
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    // 로그인 안 되어 있을 때, 빈 화면 잠깐 보여줌 (필수!)
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>마이페이지</h1>
      <p>여기는 마이페이지입니다.</p>
    </div>
  );
}

export default MyPage;
