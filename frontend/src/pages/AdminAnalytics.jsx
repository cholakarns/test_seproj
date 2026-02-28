// --- frontend/src/pages/AdminAnalytics.jsx ---
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminAnalytics({ user, onLogout }) {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("7days"); // '7days', 'month', 'year'
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/admin/chart-data?period=${period}`);
      setChartData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [period]);

  // ==========================================
  // คำนวณสถิติภาพรวมจากข้อมูลกราฟ (Summary Stats)
  // ==========================================
  const totalDrowsy = chartData.reduce((acc, curr) => acc + (curr["ง่วง/วูบ"] || 0), 0);
  const totalSleep = chartData.reduce((acc, curr) => acc + (curr["หลับใน"] || 0), 0);
  const totalStaring = chartData.reduce((acc, curr) => acc + (curr["ตาค้าง"] || 0), 0);
  const totalIncidents = totalDrowsy + totalSleep + totalStaring;

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
          <div><h1 className="text-lg font-bold text-white tracking-wide">Admin <span className="text-blue-500">Panel</span></h1></div>
        </div>

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

          {/* ลิงก์ 2: สถิติและกราฟ (Active - สีน้ำเงิน) */}
          <Link to="/admin/analytics" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-blue-600 text-white shadow-md shadow-blue-600/20">
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

          {/* ลิงก์ 4: ตั้งค่าระบบ AI */}
          <Link to="/admin/config" className="block">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /></svg>
              ตั้งค่าระบบ AI
            </button>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">{user?.username?.charAt(0).toUpperCase() || "A"}</div>
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
          <h2 className="text-2xl font-bold text-slate-800">สถิติและกราฟ (Analytics)</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto space-y-6">
            
            {/* Header & ตัวเลือกช่วงเวลา */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-slate-800">สรุปข้อมูลการแจ้งเตือนทั้งหมด</h3>
                <p className="text-sm text-slate-500">ข้อมูลรวมจากผู้ใช้งานทุกคนในระบบ แยกตามช่วงเวลา</p>
              </div>
              
              {/* ปุ่มเลือกช่วงเวลา */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl">
                <button onClick={() => setPeriod("7days")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === '7days' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>7 วันล่าสุด</button>
                <button onClick={() => setPeriod("month")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>เดือนนี้</button>
                <button onClick={() => setPeriod("year")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${period === 'year' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>ภาพรวม 1 ปี</button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p className="font-medium">กำลังคำนวณข้อมูลสถิติ...</p>
              </div>
            ) : (
              <>
                {/* 💡 [NEW] กล่องสรุปสถิติตัวเลข (Summary Stats) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center border-b-4 border-b-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">รวมทุกเหตุการณ์</p>
                    <h3 className="text-3xl font-black text-slate-800">{totalIncidents} <span className="text-sm font-medium text-slate-400">ครั้ง</span></h3>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center border-b-4 border-b-amber-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ง่วง/วูบ สะสม</p>
                    <h3 className="text-3xl font-black text-amber-500">{totalDrowsy} <span className="text-sm font-medium text-slate-400">ครั้ง</span></h3>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center border-b-4 border-b-rose-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">หลับใน สะสม</p>
                    <h3 className="text-3xl font-black text-rose-600">{totalSleep} <span className="text-sm font-medium text-slate-400">ครั้ง</span></h3>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center border-b-4 border-b-purple-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ตาค้าง สะสม</p>
                    <h3 className="text-3xl font-black text-purple-600">{totalStaring} <span className="text-sm font-medium text-slate-400">ครั้ง</span></h3>
                  </div>
                </div>

                {/* กล่องแสดงกราฟ */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-700 mb-6 text-center">
                    กราฟแสดงแนวโน้มความเสี่ยง ({period === '7days' ? '7 วันล่าสุด' : period === 'month' ? 'ประจำเดือนนี้' : 'ภาพรวมทั้งปี'})
                  </h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{fill: '#64748b'}} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f1f5f9'}} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="ง่วง/วูบ" stackId="a" fill="#f59e0b" radius={period === 'month' ? [0,0,0,0] : [0, 0, 4, 4]} />
                        <Bar dataKey="ตาค้าง" stackId="a" fill="#a855f7" />
                        <Bar dataKey="หลับใน" stackId="a" fill="#e11d48" radius={period === 'month' ? [2,2,0,0] : [4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default AdminAnalytics;