// --- frontend/src/pages/Register.jsx ---
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // เพิ่ม State สำหรับจัดการ Error
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(""); // ลบ Error เมื่อผู้ใช้เริ่มพิมพ์ใหม่
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", formData);
      // เปลี่ยนจาก alert เป็นการพาไปหน้า Login เลยเพื่อให้ราบรื่น (และอาจส่ง state ไปเพื่อแสดงข้อความสำเร็จที่หน้า login ได้ในอนาคต)
      alert("ลงทะเบียนสำเร็จ: " + response.data.message); 
      navigate("/login");
    } catch (error) {
      // แสดงข้อความ Error ใน UI
      setErrorMsg(error.response?.data?.detail || "เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: "url('/os-x-mountain-lion-3840x2160-24076.jpg')",
        width: "100vw",
        minHeight: "calc(100vh - 60px)", 
        marginLeft: "calc(-50vw + 50%)", 
        marginTop: "-2rem", 
        marginBottom: "-2rem" 
      }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        
        {/* ฝั่งซ้าย - รูปภาพประกอบ */}
        <div className="hidden md:block relative">
          <img src="/Gemini_Generated_Image_.png" alt="Register Background" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          <div className="absolute bottom-12 left-10 text-white pr-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold mb-3 drop-shadow-md">เข้าร่วมกับเรา</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              ยกระดับความปลอดภัยในการเดินทางของคุณ <br/>ด้วยระบบผู้ช่วยวิเคราะห์และตรวจจับความง่วงอัจฉริยะ
            </p>
          </div>
        </div>

        {/* ฝั่งขวา - ฟอร์มสมัครสมาชิก */}
        <div className="p-10 md:p-14 bg-white flex flex-col justify-center relative">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">สร้างบัญชีผู้ใช้งานใหม่</h2>
            <p className="text-slate-500 font-medium">กรุณากรอกข้อมูลด้านล่างเพื่อลงทะเบียนเข้าสู่ระบบ</p>
          </div>

          {/* กล่องแสดงข้อความ Error แบบใหม่ */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ใช้งาน (Username)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input 
                  name="username" 
                  type="text" 
                  required 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-slate-900" 
                  placeholder="อย่างน้อย 3 ตัวอักษร" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">อีเมล (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-slate-900" 
                  placeholder="example@mail.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">รหัสผ่าน (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-slate-900" 
                  placeholder="อย่างน้อย 6 ตัวอักษร" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3.5 text-white font-bold text-lg shadow-lg hover:shadow-slate-900/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "กำลังดำเนินการ..." : "ยืนยันการลงทะเบียน"}
            </button>
          </form>

          <p className="text-slate-500 mt-10 text-center font-medium">
            มีบัญชีผู้ใช้งานอยู่แล้วใช่หรือไม่?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 underline-offset-4 hover:underline transition-all">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;