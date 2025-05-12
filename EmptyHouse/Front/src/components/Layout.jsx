import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css'; // CSS 파일 불러오기

function Layout({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo-area">
          <img src="/logo.png" alt="로고" className="logo-img" />
          <span className="logo-text">머무름</span>
        </Link>

        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="mypage-link">마이페이지</Link>
              <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <div className="auth-box">
              <Link to="/login" className="auth-link">로그인</Link>
              <span className="divider">|</span>
              <Link to="/signup" className="auth-link">회원가입</Link>
            </div>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
