// --- frontend/src/pages/SystemConfig.jsx ---
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function SystemConfig({ user, onLogout }) {
  // 1. เพิ่ม staring_time เข้าไปใน State
  const [config, setConfig] = useState({
    ear_threshold: 0.2,
    drowsy_time: 2.0,
    sleep_time: 3.0,
    staring_time: 8.0 // เพิ่มค่าตาค้าง (เริ่มต้น 8 วินาที)
  });
  
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/config");
        setConfig({
          ear_threshold: res.data.ear_threshold,
          drowsy_time: res.data.drowsy_time,
          sleep_time: res.data.sleep_time,
          staring_time: res.data.staring_time || 8.0 // รับค่าจาก Backend (ถ้าไม่มีให้ใช้ 8.0)
        });
      } catch (error) {
        setMessage({ text: "ไม่สามารถดึงข้อมูลการตั้งค่าจากเซิร์ฟเวอร์ได้", type: "error" });
      } finally {
        setIsFetching(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    if (message.text) setMessage({ text: "", type: "" });
    setConfig({ ...config, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.put("http://127.0.0.1:8000/api/admin/config", config);
      setMessage({ text: "บันทึกการตั้งค่าระบบ AI สำเร็จ", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      setMessage({ text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="min-h-[100vh] bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden relative"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", marginTop: "-2rem", marginBottom: "-2rem" }}
    >
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 shadow-xl z-20">
        <div className="h-20 flex items-center px-6 bg-slate-950/50 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Admin <span className="text-blue-500">Panel</span></h1>
          </div>
        </div>

        {/* เมนูด้านข้าง อัปเดตให้มีครบ 4 เมนู */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* ลิงก์ 1: ภาพรวมระบบ */}
          <Link to="/dashboard" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              ภาพรวมระบบ
            </button>
          </Link>

          {/* ลิงก์ 2: สถิติและกราฟ */}
          <Link to="/admin/analytics" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              สถิติและกราฟ
            </button>
          </Link>
          
          {/* ลิงก์ 3: จัดการผู้ใช้งาน */}
          <Link to="/admin/users" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              จัดการผู้ใช้งาน
            </button>
          </Link>

          {/* ลิงก์ 4: ตั้งค่าระบบ AI (Active - สีน้ำเงิน) */}
          <Link to="/admin/config" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /></svg>
              ตั้งค่าระบบ AI
            </button>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="text-sm">
              <p className="font-bold text-white">{user?.username || "Admin"}</p>
              <p className="text-xs text-slate-500">Super Administrator</p>
            </div>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors font-medium text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>
              ออกจากระบบ
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-slate-800">ตั้งค่าระบบ AI (System Configuration)</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
            
            {message.text && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-4 rounded-xl flex items-center gap-3 border font-medium text-sm ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
                {message.type === "success" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                )}
                {message.text}
              </motion.div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">พารามิเตอร์ของระบบตรวจจับ</h3>
                <p className="text-sm text-slate-500">ปรับแต่งความแม่นยำและความไวในการแจ้งเตือนของระบบ AI วิเคราะห์ใบหน้า</p>
              </div>

              {isFetching ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600 mb-4"></div>
                  <p>กำลังโหลดการตั้งค่า...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* 1. EAR Threshold */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <label className="text-base font-bold text-slate-800 block mb-1">ค่า EAR Threshold (ระดับการหลับตา)</label>
                        <p className="text-xs text-slate-500">ค่าน้อย (เช่น 0.15) = ต้องหลับตาแน่นมากถึงจะเตือน <br/>ค่ามาก (เช่น 0.25) = แค่ตาปรือระบบก็จะเริ่มเตือน</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono font-bold text-blue-600 text-lg shadow-sm w-24 text-center">{config.ear_threshold.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400">0.10</span>
                      <input type="range" name="ear_threshold" min="0.10" max="0.35" step="0.01" value={config.ear_threshold} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      <span className="text-xs font-bold text-slate-400">0.35</span>
                    </div>
                  </div>

                  {/* 2. Drowsy Time */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <label className="text-base font-bold text-slate-800 block mb-1">เวลาแจ้งเตือน "ง่วง/วูบ" (วินาที)</label>
                        <p className="text-xs text-slate-500">ระยะเวลาที่ผู้ใช้หลับตาติดต่อกันก่อนที่ระบบจะส่งเสียงเตือนสีส้ม</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono font-bold text-amber-500 text-lg shadow-sm w-24 text-center">{config.drowsy_time.toFixed(1)}s</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400">0.5s</span>
                      <input type="range" name="drowsy_time" min="0.5" max="5.0" step="0.1" value={config.drowsy_time} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                      <span className="text-xs font-bold text-slate-400">5.0s</span>
                    </div>
                  </div>

                  {/* 3. Deep Sleep Time */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <label className="text-base font-bold text-slate-800 block mb-1">เวลาแจ้งเตือน "หลับใน" อันตราย (วินาที)</label>
                        <p className="text-xs text-slate-500">ระยะเวลาขั้นวิกฤตที่ผู้ใช้หลับตาติดต่อกัน ระบบจะส่งเสียงเตือนสีแดง</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono font-bold text-rose-600 text-lg shadow-sm w-24 text-center">{config.sleep_time.toFixed(1)}s</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400">1.0s</span>
                      <input type="range" name="sleep_time" min="1.0" max="10.0" step="0.1" value={config.sleep_time} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600" />
                      <span className="text-xs font-bold text-slate-400">10.0s</span>
                    </div>
                  </div>

                  {/* 4. Staring Time (เวลาตาค้าง) */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <label className="text-base font-bold text-slate-800 block mb-1">เวลาแจ้งเตือน "ตาค้าง/เหม่อลอย" (วินาที)</label>
                        <p className="text-xs text-slate-500">ระยะเวลาที่ผู้ใช้เบิกตาค้าง (ไม่กะพริบตาเลย) ติดต่อกันจนผิดปกติ</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono font-bold text-purple-600 text-lg shadow-sm w-24 text-center">{config.staring_time.toFixed(1)}s</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400">3.0s</span>
                      <input type="range" name="staring_time" min="3.0" max="15.0" step="0.5" value={config.staring_time} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                      <span className="text-xs font-bold text-slate-400">15.0s</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all duration-200 disabled:opacity-70 flex items-center gap-2">
                      {isSaving ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>กำลังบันทึก...</>
                      ) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg>บันทึกการตั้งค่า</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default SystemConfig;