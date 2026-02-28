// --- frontend/src/pages/History.jsx ---
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function History({ user }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลประวัติจาก API ของจริง
  useEffect(() => {
    // ดักรอให้มีข้อมูล user ก่อนค่อยดึงข้อมูล (เหมือนโค้ดเดิมของคุณ)
    if (!user || !user.username) {
        setIsLoading(false);
        return; 
    }

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // 👇 แก้ไข URL กลับไปใช้ ?user_id= เหมือนโค้ดเดิมของคุณ
        const res = await axios.get(`http://127.0.0.1:8000/api/logs?user_id=${user.username}`);
        
        if (res.data && res.data.length > 0) {
            setLogs(res.data);
        } else {
            setLogs([]); 
        }
        setError(null);
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลประวัติได้:", err);
        setError("ไม่สามารถดึงข้อมูลประวัติได้ หรือยังไม่มีข้อมูล");
        setLogs([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // จัดกลุ่มข้อมูลสำหรับกราฟ (สรุปจำนวนเหตุการณ์แต่ละวัน)
  const chartData = logs.reduce((acc, log) => {
    if (!log.timestamp) return acc;
    
    const dateObj = new Date(log.timestamp);
    const dateStr = dateObj.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      if (log.event_type === "deep_sleep") existing.deep_sleep += 1;
      else existing.drowsy += 1;
    } else {
      acc.push({
        date: dateStr,
        drowsy: log.event_type === "drowsy" ? 1 : 0,
        deep_sleep: log.event_type === "deep_sleep" ? 1 : 0,
      });
    }
    return acc;
  }, []);

  // ฟังก์ชันจัดรูปแบบวันที่ให้สวยงาม
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString('th-TH', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute:'2-digit', second:'2-digit' 
    });
  };

  // คอมโพเนนต์ป้ายกำกับ (Badge)
  const EventBadge = ({ type }) => {
    if (type === "deep_sleep") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>
          หลับใน (Deep Sleep)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
        เริ่มวูบ (Drowsy)
      </span>
    );
  };

  // คอมโพเนนต์ Tooltip แต่งสวยๆ สำหรับ Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 z-50">
          <p className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-2">{`วันที่ ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium flex justify-between gap-4 my-1" style={{ color: entry.color }}>
              <span>{entry.name === "deep_sleep" ? "หลับใน" : "เริ่มวูบ"} :</span>
              <span>{entry.value} ครั้ง</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* ส่วนหัวหน้าเว็บ */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          รายงานประวัติและสถิติการขับขี่
        </h1>
        <p className="text-gray-500 font-medium">ภาพรวมพฤติกรรมและความปลอดภัยของผู้ใช้งาน: <span className="font-bold text-gray-700">{user?.username || "Guest"}</span></p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >

          {/* แจ้งเตือน Error ถ้ามี */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
              {error}
            </div>
          )}

          {/* ส่วนกราฟสรุปผล (Analytics Dashboard) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* กล่องสถิติย่อย */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">เหตุการณ์ทั้งหมด</p>
                  <h3 className="text-4xl font-black text-gray-800">{logs.length} <span className="text-lg font-medium text-gray-500">ครั้ง</span></h3>
                </div>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125-1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">หลับในอันตราย</p>
                  <h3 className="text-4xl font-black text-rose-600">{logs.filter(l => l.event_type === "deep_sleep").length} <span className="text-lg font-medium text-gray-500">ครั้ง</span></h3>
                </div>
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                </div>
              </div>
            </div>

            {/* กราฟแท่ง (Bar Chart) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-6">ความถี่ของอาการง่วงแยกตามวัน</h3>
              <div className="w-full h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }}/>
                      <Bar dataKey="drowsy" name="เริ่มวูบ" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="deep_sleep" name="หลับใน" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                    <p>ยังไม่มีข้อมูลสถิติเพียงพอสำหรับสร้างกราฟ</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ส่วนตารางข้อมูล (Data Table) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">รายละเอียดเหตุการณ์ล่าสุด (เรียงจากใหม่ไปเก่า)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">ลำดับ</th>
                    <th className="px-6 py-4 font-bold">วัน-เวลาที่เกิดเหตุ</th>
                    <th className="px-6 py-4 font-bold">ประเภทความเสี่ยง</th>
                    <th className="px-6 py-4 font-bold text-center">ระยะเวลา (วินาที)</th>
                    <th className="px-6 py-4 font-bold text-center">ค่า EAR ขณะหลับตา</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* เรียงข้อมูลจากใหม่สุดไปเก่าสุด ก่อนนำมาแสดงในตาราง */}
                  {[...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((log, index) => (
                    <tr 
                      key={log.id || index} 
                      className="even:bg-slate-50 hover:bg-blue-50/60 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-500 group-hover:text-blue-600">
                        #{logs.length - index}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <EventBadge type={log.event_type} />
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 text-center">
                        {log.duration_ms ? (log.duration_ms / 1000).toFixed(1) + 's' : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-center">
                        {log.ear_value ? (
                          <span className={`px-2 py-1 rounded bg-gray-100 border border-gray-200 ${parseFloat(log.ear_value) < 0.2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {parseFloat(log.ear_value).toFixed(2)}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4 text-emerald-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-600 mb-1">ยอดเยี่ยม! ไม่พบประวัติการแจ้งเตือนความง่วง</p>
                          <p className="text-sm">พฤติกรรมการขับขี่ของคุณอยู่ในเกณฑ์ปลอดภัย</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default History;