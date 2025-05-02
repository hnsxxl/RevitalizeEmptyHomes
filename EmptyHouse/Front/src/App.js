import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindProperty from './pages/FindProperty';
import RegisterProperty from './pages/RegisterProperty';
import MyPage from './pages/MyPage';
import DetailPage from './pages/DetailPage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext'; // ✅ 추가

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/find-property" element={<FindProperty />} />
            <Route path="/register-property" element={<RegisterProperty />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
