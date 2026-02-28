// --- frontend/src/pages/Welcome.jsx ---
import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    // 👇 [แก้ไขตรงนี้] เพิ่ม style ดึงภาพให้ทะลุกรอบ padding ของ App.jsx
    <div 
      className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: "url('/windows-11-stock-official-light-3840x2160-5664.jpg')",
        width: "100vw",
        minHeight: "calc(100vh - 60px)", // ยืดให้เกือบเต็มจอ (หัก Navbar)
        marginLeft: "calc(-50vw + 50%)", // ดึงขอบซ้าย-ขวาให้ชนขอบจอ
        marginTop: "-2rem", // ดึงขอบบนทะลุ padding
        marginBottom: "-2rem" // ดึงขอบล่างทะลุ padding
      }}
    >
      {/* เลเยอร์สีดำโปร่งแสง */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      {/* เนื้อหา (z-10 เพื่อให้อยู่เหนือรูป Background) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* ส่วนหัว (Hero Section) */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 text-sm font-medium mb-8 shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            SE4AI Drowsiness System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            ระบบผู้ช่วย AI <br className="hidden md:block" />
            <span className="text-blue-400">ตรวจจับความง่วงแบบเรียลไทม์</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            เทคโนโลยีวิเคราะห์ใบหน้าและดวงตาขั้นสูง 
            ช่วยปกป้องคุณและเพื่อนร่วมทางให้ถึงที่หมายอย่างปลอดภัยในทุกเส้นทาง
          </p>
        </div>

        {/* ส่วนแสดงฟีเจอร์เด่น (Feature Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-16">
          
          {/* Feature 1 */}
          <div className="bg-slate-900/70 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-800/80 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ตรวจจับแม่นยำ</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              วิเคราะห์ใบหน้าและดวงตาด้วย AI ความเร็วสูงผ่านกล้อง Webcam บนอุปกรณ์ของคุณ
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/70 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-800/80 transition-all duration-300">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">แจ้งเตือนทันที</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              ระบบเสียงเตือนอัตโนมัติทำงานทันที เมื่อตรวจพบพฤติกรรมเสี่ยง อาการวูบ หรือหลับใน
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/70 backdrop-blur-md p-8 rounded-2xl border border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-slate-800/80 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">บันทึกสถิติ</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              เก็บประวัติการเดินทางและวิเคราะห์พฤติกรรมการขับขี่ของคุณ เพื่อประเมินความปลอดภัย
            </p>
          </div>

        </div>

        {/* ปุ่ม Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-lg transition-colors shadow-lg hover:shadow-blue-500/25">
              เข้าสู่ระบบ
            </button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-white border border-slate-600 rounded-xl font-medium text-lg transition-colors shadow-lg">
              สมัครสมาชิกใหม่
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Welcome;