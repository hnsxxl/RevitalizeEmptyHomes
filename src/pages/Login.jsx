import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // ✅ 추가

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setIsLoggedIn } = useAuth(); // ✅ props 대신 context에서 가져오기

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);

    setIsLoggedIn(true); // ✅ 전역 상태 변경
    navigate('/');
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>이메일: </label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>비밀번호: </label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
