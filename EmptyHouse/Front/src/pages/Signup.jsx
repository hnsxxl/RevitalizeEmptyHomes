import { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/signup', {
        email,
        password
      });

      console.log(res.data);
      setStatus('✅ 회원가입 성공!');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail === "이미 가입된 이메일입니다.") {
        setStatus('❌ 이미 가입된 이메일입니다.');
      } else {
        setStatus('❌ 회원가입 실패');
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: "10px" }}>
          <label>이름: </label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">회원가입</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default Signup;