import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();  // ★ setUser 추가!

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('❌ 이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          setError('서버 오류가 발생했습니다.');
        }
        return;
      }

      // ✅ 로그인 성공시 받은 user 정보 활용!
      const data = await response.json();

      setIsLoggedIn(true);
      setUser({
        email: data.email,
        //name: data.name,         // 백엔드에서 name 없으면 undefined 가능
        //user_id: data.user_id,   // 필요시 추가
      });

      navigate('/'); // 원하는 경로로 이동

    } catch (err) {
      setError('서버 연결 실패: ' + err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h1 className="login-title">로그인</h1>
        <hr className="login-divider" />
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        )}
        <div className="login-input-group">
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">로그인</button>
        <div className="signup-link">
          <Link to="/signup">회원가입</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;