import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) { // 👈 props로 받기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);

    setIsLoggedIn(true); // 👈 로그인 상태 true로 변경!
    navigate('/'); // 홈으로 이동
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
