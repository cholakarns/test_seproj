// --- frontend/src/App.jsx ---
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import WebcamCapture from './pages/WebcamCapture';
import UserManagement from './pages/UserManagement'; 
import SystemConfig from './pages/SystemConfig'; 
import Profile from './pages/Profile'; 
import History from './pages/History'; 
import Dashboard from './pages/Dashboard'; 
import AdminAnalytics from './pages/AdminAnalytics'; 

function App() {
  // โหลด user จาก localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('drowsiness_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [status, setStatus] = useState("กำลังตรวจสอบ...");

  // ✅ FIX: ใช้ Backend URL จาก Environment Variable
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const API = import.meta.env.VITE_API_URL; // 👈 จาก Vercel
        const res = await axios.get(`${API}/`);
        setStatus(` ${res.data.message || "ระบบพร้อมใช้งาน"}`);
      } catch (error) {
        setStatus(" เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
      }
    };
    checkStatus();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('drowsiness_user');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
        
        <Navbar user={user} onLogout={handleLogout} status={status} />
        
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Welcome />} />
            
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={setUser} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />
            
            <Route
              path="/dashboard"
              element={
                !user ? <Navigate to="/login" /> : 
                user.role === 'admin'
                  ? <AdminDashboard user={user} onLogout={handleLogout} />
                  : <Dashboard user={user} />
              }
            />

            <Route
              path="/camera"
              element={
                !user ? <Navigate to="/login" /> : 
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 text-center w-full max-w-5xl mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    ระบบกล้องวิเคราะห์ใบหน้า
                  </h2>
                  <p className="text-slate-500 mb-8">
                    ผู้ใช้งาน: <span className="font-semibold text-slate-700">{user.username}</span>
                  </p>
                  <div className="flex justify-center w-full">
                    <WebcamCapture user={user} />
                  </div>
                </div>
              }
            />

            <Route path="/history" element={!user ? <Navigate to="/login" /> : <History user={user} />} />
            <Route path="/profile" element={!user ? <Navigate to="/login" /> : <Profile user={user} />} />

            <Route
              path="/admin/users"
              element={
                !user ? <Navigate to="/login" /> :
                user.role === 'admin'
                  ? <UserManagement user={user} onLogout={handleLogout} />
                  : <Navigate to="/dashboard" />
              }
            />

            <Route
              path="/admin/config"
              element={
                !user ? <Navigate to="/login" /> :
                user.role === 'admin'
                  ? <SystemConfig user={user} onLogout={handleLogout} />
                  : <Navigate to="/dashboard" />
              }
            />

            <Route
              path="/admin/analytics"
              element={
                !user ? <Navigate to="/login" /> :
                user.role === 'admin'
                  ? <AdminAnalytics user={user} onLogout={handleLogout} />
                  : <Navigate to="/dashboard" />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;