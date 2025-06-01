import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validatePassword = (pw) => {
    const lengthCheck = pw.length >= 8;
    const letterCheck = /[a-zA-Z]/.test(pw);
    const numberCheck = /\d/.test(pw);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    return {
      isValid: lengthCheck && letterCheck && numberCheck && specialCharCheck,
      lengthCheck,
      letterCheck,
      numberCheck,
      specialCharCheck
    };
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // ✨ fetch 사용해서 백엔드로 회원가입 정보 전송!
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    const pwStatus = validatePassword(password);

    if (!pwStatus.isValid) {
      alert('❌ 비밀번호는 8자리 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      alert('❌ 비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.detail || '회원가입 실패');
      }
    } catch (error) {
      setError('서버 연결 실패: ' + error.message);
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSignup}>
        <h1 className="signup-title">회원가입</h1>
        <hr className="signup-divider" />

        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        )}

        <div className="signup-input-group horizontal">
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-group horizontal">
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-group horizontal">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-group horizontal">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {confirmPassword && (
          <div
            style={{
              fontSize: '0.85rem',
              marginBottom: '10px',
              color: passwordsMatch ? 'green' : 'red'
            }}
          >
            {passwordsMatch
              ? '✅ 비밀번호가 일치합니다'
              : '❌ 비밀번호가 일치하지 않습니다'}
          </div>
        )}

        <button type="submit" className="signup-button">회원가입</button>

        <div className="signup-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
