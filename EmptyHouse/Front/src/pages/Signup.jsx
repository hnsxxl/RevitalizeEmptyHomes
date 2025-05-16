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

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    const pwStatus = validatePassword(password);

    if (!pwStatus.isValid) {
      alert('❌ 비밀번호는 8자리 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
      return;
    }

    // 회원가입 시 회원 정보 저장 -> 백 서버 연결 후 제거하기
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);

    alert('회원가입이 완료되었습니다!');
    navigate('/login');
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
