import { useState } from 'react';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    console.log('이름:', name);
    console.log('이메일:', email);
    console.log('비밀번호:', password);
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
    </div>
  );
}

export default Signup;
