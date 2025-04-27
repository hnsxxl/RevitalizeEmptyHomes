import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // 👈 추가
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindProperty from './pages/FindProperty';
import RegisterProperty from './pages/RegisterProperty';
import MyPage from './pages/MyPage';
import DetailPage from './pages/DetailPage';
import Layout from './components/Layout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 추가

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-property" element={<FindProperty />} />
          <Route path="/register-property" element={<RegisterProperty />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
