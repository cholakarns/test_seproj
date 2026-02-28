// --- frontend/src/pages/Dashboard.jsx ---
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

function Dashboard({ user }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ตั้งค่าเริ่มต้น: โหมด 7 วัน และเดือนปัจจุบัน
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [period, setPeriod] = useState("7d"); // "7d", "month", "year"
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); 

  // ดึงข้อมูลใหม่ทุกครั้งที่ผู้ใช้กดเปลี่ยนโหมด หรือเปลี่ยนเดือน
  useEffect(() => {
    if (user && user.username) {
      fetchStats();
    }
  }, [user, period, selectedMonth]); 

  const fetchStats = async () => {
    try {
      setLoading(true);
      // ส่ง period, เดือน (m) และ ปี (y) ไปให้ Backend คำนวณ
      const res = await axios.get(`http://127.0.0.1:8000/api/logs/stats?user_id=${user.username}&period=${period}&m=${selectedMonth}&y=${currentYear}`);
      setChartData(res.data);
    } catch (err) {
      console.error("❌ ไม่สามารถดึงข้อมูลสถิติได้:", err);
    } finally {
      setLoading(false);
    }
  };

  // สไตล์สำหรับปุ่มกด (Active = สีฟ้า, ไม่ Active = สีเทา)
  const getButtonStyle = (currentPeriod) => ({
    padding: "8px 20px",
    margin: "0 5px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: period === currentPeriod ? "#3498db" : "#ecf0f1",
    color: period === currentPeriod ? "white" : "#7f8c8d",
    transition: "all 0.3s"
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>📊 สถิติความง่วงของคุณ</h2>
      
      {/* ส่วนปุ่มเลือกโหมด */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
        <button style={getButtonStyle("7d")} onClick={() => setPeriod("7d")}>📅 7 วันล่าสุด</button>
        <button style={getButtonStyle("month")} onClick={() => setPeriod("month")}>📆 รายเดือน (1-12)</button>
        <button style={getButtonStyle("year")} onClick={() => setPeriod("year")}>📈 ภาพรวม 1 ปี</button>
      </div>

      {/* 🔴 [NEW] จะแสดง Dropdown ให้เลือกเดือน 1-12 ก็ต่อเมื่อกดปุ่ม "รายเดือน" */}
      {period === "month" && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", alignItems: "center" }}>
          <span style={{ marginRight: "10px", fontWeight: "bold", color: "#2c3e50" }}>เลือกเดือน:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ padding: "8px 15px", borderRadius: "5px", border: "1px solid #bdc3c7", fontSize: "16px", cursor: "pointer" }}
          >
            {[...Array(12).keys()].map(i => (
              <option key={i+1} value={i+1}>เดือนที่ {i+1}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* ส่วนแสดงกราฟ */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        height: "450px"
      }}>
        {loading ? (
           <div style={{ textAlign: "center", paddingTop: "150px" }}>กำลังอัปเดตกราฟ...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {/* ถ้าดูโหมดเดือน (มี 30 แท่ง) ให้ตัวหนังสือแกน X เอียง 45 องศา จะได้ไม่เบียดกัน */}
              <XAxis 
                dataKey="date" 
                tick={{fontSize: 12}} 
                angle={period === "month" ? -45 : 0} 
                textAnchor={period === "month" ? "end" : "middle"} 
              />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }} />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="drowsy" name="วูบ (ครั้ง)" fill="#f39c12" radius={[5, 5, 0, 0]} />
              <Bar dataKey="deep_sleep" name="หลับใน (ครั้ง)" fill="#c0392b" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;