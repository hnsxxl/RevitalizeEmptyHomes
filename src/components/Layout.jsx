import { useLocation, Link, useNavigate } from 'react-router-dom';

function Layout({ children, isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/'); // 로그아웃 후 홈으로 이동
  };

  return (
    <div>
      <nav style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        alignItems: "center"
      }}>
        {/* 왼쪽 - 홈 아니면 빈집찾기 */}
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {!isHome && (
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>빈집찾기</Link>
          )}
        </div>

        {/* 오른쪽 - 항상 로그인/회원가입 또는 마이페이지/로그아웃 */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {!isHome && (
            <>
              <Link to="/find-property" style={{ textDecoration: "none", color: "black" }}>매물찾기</Link>
              <Link to="/register-property" style={{ textDecoration: "none", color: "black" }}>매도의뢰</Link>
            </>
          )}
          
          {isLoggedIn ? (
            <>
              <Link to="/mypage" style={{ textDecoration: "none", color: "gray" }}>마이페이지</Link>
              <button onClick={handleLogout} style={{
                background: "none",
                border: "none",
                color: "gray",
                cursor: "pointer",
                fontSize: "1rem"
              }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "gray" }}>로그인</Link>
              <Link to="/signup" style={{ textDecoration: "none", color: "gray" }}>회원가입</Link>
            </>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}

export default Layout;
