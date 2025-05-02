import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/login", {
        email,
        password
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);                  
      alert("로그인 성공!");

      navigate('/'); 

    } catch (err) {
      console.error(err);
      alert("로그인 실패! 이메일 또는 비밀번호를 확인하세요.");
    }
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