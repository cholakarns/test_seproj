# --- backend/app/models/models.py ---
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timedelta

# 💡 [เพิ่มใหม่] ฟังก์ชันดึงเวลาปัจจุบันของประเทศไทย (UTC+7)
def get_thai_time():
    return datetime.utcnow() + timedelta(hours=7)

# 1. แบบแปลนสำหรับ "สมัครสมาชิก"
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

# 2. แบบแปลนสำหรับ "เข้าสู่ระบบ"
class UserLogin(BaseModel):
    username: str
    password: str

# 3. แบบแปลนสำหรับ LOGGING
class LogEntry(BaseModel):
    user_id: str
    event_type: str       # เช่น "drowsy", "deep_sleep", "staring"
    ear_value: float      # ค่า EAR ณ เวลาที่เกิดเหตุ
    duration_ms: int = 0  # ระยะเวลาที่หลับ (ms)
    # 💡 บังคับให้ Default ใช้เวลาประเทศไทยในการบันทึกลง Database ทันที
    timestamp: datetime = Field(default_factory=get_thai_time)