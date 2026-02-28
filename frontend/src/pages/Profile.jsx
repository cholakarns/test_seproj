// --- frontend/src/pages/Profile.jsx ---
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Profile({ user }) {
  // ==========================================
  // 1. State สำหรับเก็บข้อมูลจริงจาก API
  // ==========================================
  const [profileData, setProfileData] = useState({ username: "", email: "", role: "" });
  const [formData, setFormData] = useState({ email: "", currentPassword: "", newPassword: "" });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // State สำหรับการตั้งค่าระบบจำลอง (Toggle Switches)
  const [settings, setSettings] = useState({
    soundAlerts: true,
    emailNotifications: false,
    autoSaveHistory: true
  });

  // ==========================================
  // 2. ฟังก์ชันดึงและอัปเดตข้อมูล (API Functions)
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/users/me?username=${user.username}`);
        setProfileData(res.data);
        setFormData({ email: res.data.email || "", currentPassword: "", newPassword: "" });
        setIsLoading(false);
      } catch (err) {
        setMessage({ text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้", type: "error" });
        setIsLoading(false);
      }
    };

    if (user && user.username) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // เคลียร์ข้อความแจ้งเตือนเมื่อผู้ใช้เริ่มพิมพ์ใหม่
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleToggle = (settingKey) => {
    setSettings({ ...settings, [settingKey]: !settings[settingKey] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        username: user.username,
        email: formData.email,
        current_password: formData.currentPassword || null,
        new_password: formData.newPassword || null
      };

      const res = await axios.put("http://127.0.0.1:8000/api/users/me", payload);
      
      setMessage({ text: res.data.message || "บันทึกข้อมูลเรียบร้อยแล้ว", type: "success" });
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      
      // ดึงข้อมูลใหม่เพื่ออัปเดต UI ฝั่งซ้าย
      const updatedRes = await axios.get(`http://127.0.0.1:8000/api/users/me?username=${user.username}`);
      setProfileData(updatedRes.data);
      
      // ให้ข้อความสำเร็จหายไปเองหลัง 3 วินาที
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);

    } catch (err) {
      setMessage({ 
        text: err.response?.data?.detail || "เกิดข้อผิดพลาดในการบันทึกข้อมูล", 
        type: "error" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // 3. Components ช่วยเหลือ (Helpers)
  // ==========================================
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const ToggleSwitch = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-bold text-gray-800">{label}</span>
        <span className="text-xs text-gray-500 mt-1">{description}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          isEnabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
            isEnabled ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  // ==========================================
  // 4. หน้าจอ Render
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium tracking-wide">กำลังโหลดข้อมูลบัญชี...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* ส่วนหัวหน้าเว็บ */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          บัญชีและการตั้งค่า
        </h1>
        <p className="text-gray-500 font-medium">จัดการข้อมูลส่วนตัวและปรับแต่งการทำงานของระบบ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* ========================================== */}
        {/* คอลัมน์ซ้าย: รูปโปรไฟล์ & ข้อมูลสรุป */}
        {/* ========================================== */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            
            {/* Avatar Placeholder */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-5xl font-black text-blue-600 shadow-inner border-4 border-white">
                {getInitial(profileData.username || user?.username)}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              {profileData.username || user?.username}
            </h2>
            <p className="text-gray-500 mb-5">{profileData.email || "ยังไม่ได้ระบุอีเมล"}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 0-7.877 3.08.75.75 0 0 0-.172.8A11.15 11.15 0 0 0 7.19 10.518a.75.75 0 0 0 .584-.526 9.664 9.664 0 0 1 3.253-4.502.75.75 0 0 0 .338-1.082 1.5 1.5 0 0 1 1.27-2.228ZM12 4.5a.75.75 0 0 0-.75.75v3.132a.75.75 0 0 0 1.5 0V5.25A.75.75 0 0 0 12 4.5Z" clipRule="evenodd" />
              </svg>
              {profileData.role === "admin" ? "ผู้ดูแลระบบ (Admin)" : "ผู้ใช้งาน (Driver)"}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">ข้อมูลบัญชี</h3>
             <ul className="space-y-3 text-sm">
               <li className="flex justify-between items-center">
                 <span className="text-gray-500">สถานะการเชื่อมต่อ</span>
                 <span className="font-medium text-emerald-600 flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ปกติ
                 </span>
               </li>
               <li className="flex justify-between items-center">
              
               </li>
             </ul>
          </div>
        </div>

        {/* ========================================== */}
        {/* คอลัมน์ขวา: ฟอร์มแก้ไข & การตั้งค่า */}
        {/* ========================================== */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              แก้ไขข้อมูลส่วนตัว
            </h2>

            {/* แสดงข้อความแจ้งเตือน (Alert Messages) */}
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 border font-medium text-sm ${
                  message.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
              >
                {message.type === "success" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                )}
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">ชื่อผู้ใช้งาน (Username)</label>
                <input 
                  type="text" 
                  value={user?.username || ""}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 text-gray-500 px-4 py-3 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-400">ไม่สามารถแก้ไขชื่อผู้ใช้งานได้</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">อีเมล (Email)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-800 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">เปลี่ยนรหัสผ่าน</h3>
               <span className="text-xs text-gray-400">หากไม่ต้องการเปลี่ยน ให้เว้นว่างไว้</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">รหัสผ่านปัจจุบัน</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">รหัสผ่านใหม่</label>
                <input 
                  type="password" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* ส่วนตั้งค่าระบบด้วย Toggle Switch (จำลองสำหรับ UI) */}
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 pt-6 border-t border-gray-100">
              การตั้งค่าระบบ (System Preferences)
            </h3>
            <div className="mb-8 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <ToggleSwitch 
                label="เสียงแจ้งเตือนระบบ" 
                description="เปิดใช้งานเสียงเตือนเมื่อระบบประมวลผลกล้องทำงาน"
                isEnabled={settings.soundAlerts}
                onToggle={() => handleToggle('soundAlerts')}
              />
              <ToggleSwitch 
                label="การแจ้งเตือนทางอีเมล" 
                description="รับการแจ้งเตือนรายงานสถิติการใช้งาน"
                isEnabled={settings.emailNotifications}
                onToggle={() => handleToggle('emailNotifications')}
              />
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all duration-200 disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg>
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
}

export default Profile;