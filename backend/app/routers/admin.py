# --- backend/app/routers/admin.py ---
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import db
from datetime import datetime, time, timedelta  # 👈 เพิ่ม timedelta ตรงนี้
from bson import ObjectId
import calendar

router = APIRouter()

# ==========================================
# 1. API ดึงสถิติภาพรวม (Dashboard Stats)
# ==========================================
@router.get("/api/admin/stats")
async def get_admin_stats():
    total_users = await db.users.count_documents({"role": "user"})
    total_logs = await db.logs.count_documents({})
    
    # 💡 [ส่วนที่แก้ไข] ใช้เวลาประเทศไทย (UTC+7) ในการคำนวณ "วันนี้"
    thai_now = datetime.utcnow() + timedelta(hours=7)
    today_start = datetime.combine(thai_now.date(), time.min)
    
    # นับจำนวนแจ้งเตือนเฉพาะวันนี้ (เวลาไทย)
    today_alerts = await db.logs.count_documents({"timestamp": {"$gte": today_start}})
    
    deep_sleep_today = await db.logs.count_documents({
        "timestamp": {"$gte": today_start},
        "event_type": "deep_sleep"
    })
    
    staring_today = await db.logs.count_documents({
        "timestamp": {"$gte": today_start},
        "event_type": "staring"
    })
    
    return {
        "total_users": total_users,
        "total_logs": total_logs,
        "today_alerts": today_alerts,
        "deep_sleep_today": deep_sleep_today,
        "staring_today": staring_today 
    }

# ==========================================
# 2. API ดึงรายชื่อผู้ใช้ทั้งหมด (User Management)
# ==========================================
@router.get("/api/admin/users")
async def get_all_users():
    users = await db.users.find({}).to_list(1000)
    result = []
    for u in users:
        u["id"] = str(u["_id"])
        del u["_id"]
        
        if "password" in u:
            del u["password"]
            
        if "is_suspended" not in u:
            u["is_suspended"] = False
            
        result.append(u)
    return result

# ==========================================
# 3. API ระงับ/ปลดแบน บัญชีผู้ใช้ (Suspend/Unsuspend)
# ==========================================
class SuspendPayload(BaseModel):
    is_suspended: bool

@router.put("/api/admin/users/{user_id}/suspend")
async def toggle_suspend_user(user_id: str, payload: SuspendPayload):
    try:
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_suspended": payload.is_suspended}}
        )
        if result.matched_count == 1:
            return {"message": "อัปเดตสถานะผู้ใช้งานสำเร็จ"}
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งาน")
    except Exception:
        raise HTTPException(status_code=400, detail="รูปแบบ ID ผู้ใช้ไม่ถูกต้อง")

# ==========================================
# 4. API ลบผู้ใช้และประวัติการขับขี่ถาวร (Delete User)
# ==========================================
@router.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str):
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งาน")
        
        username = user.get("username")
        
        result = await db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 1:
            await db.logs.delete_many({"user_id": username})
            return {"message": "ลบผู้ใช้และประวัติสำเร็จ"}
            
    except Exception:
        raise HTTPException(status_code=400, detail="รูปแบบ ID ผู้ใช้ไม่ถูกต้อง")

# ==========================================
# 5. API ดึงค่าการตั้งค่าระบบ (GET AI Config)
# ==========================================
@router.get("/api/admin/config")
async def get_system_config():
    config = await db.config.find_one({"type": "ai_threshold"})
    
    if not config:
        default_config = {
            "type": "ai_threshold",
            "ear_threshold": 0.2,
            "drowsy_time": 2.0,
            "sleep_time": 3.0,
            "staring_time": 8.0 
        }
        await db.config.insert_one(default_config)
        del default_config["_id"]
        return default_config
        
    config["id"] = str(config["_id"])
    del config["_id"]
    
    if "staring_time" not in config:
        config["staring_time"] = 8.0 
        
    return config

# ==========================================
# 6. API บันทึกการตั้งค่าระบบ (PUT AI Config)
# ==========================================
@router.put("/api/admin/config")
async def update_system_config(new_config: dict):
    if "id" in new_config:
        del new_config["id"]
    if "_id" in new_config:
        del new_config["_id"]
        
    new_config["type"] = "ai_threshold"
    
    await db.config.update_one(
        {"type": "ai_threshold"},
        {"$set": new_config},
        upsert=True
    )
    
    return {"message": "บันทึกการตั้งค่าระบบสำเร็จ", "config": new_config}

# ==========================================
# 7. API ดึงข้อมูลสำหรับทำกราฟสถิติ (7 วัน, เดือน, ปี)
# ==========================================
@router.get("/api/admin/chart-data")
async def get_admin_chart_data(period: str = "7days"):
    thai_now = datetime.utcnow() + timedelta(hours=7)
    chart_data = {}

    if period == "7days":
        start_date = datetime.combine((thai_now - timedelta(days=6)).date(), time.min)
        logs = await db.logs.find({"timestamp": {"$gte": start_date}}).to_list(None)
        
        for i in range(7):
            d = thai_now - timedelta(days=6 - i)
            day_str = d.strftime("%d/%m")
            chart_data[day_str] = {"name": day_str, "ง่วง/วูบ": 0, "หลับใน": 0, "ตาค้าง": 0}
            
        for log in logs:
            log_time = log.get("timestamp")
            if not log_time: continue
            day_str = log_time.strftime("%d/%m")
            event = log.get("event_type")
            if day_str in chart_data:
                if event == "drowsy": chart_data[day_str]["ง่วง/วูบ"] += 1
                elif event == "deep_sleep": chart_data[day_str]["หลับใน"] += 1
                elif event == "staring": chart_data[day_str]["ตาค้าง"] += 1

    elif period == "month":
        target_month = thai_now.month
        target_year = thai_now.year
        num_days = calendar.monthrange(target_year, target_month)[1]
        start_date = datetime(target_year, target_month, 1)
        end_date = start_date + timedelta(days=num_days)
        
        logs = await db.logs.find({"timestamp": {"$gte": start_date, "$lt": end_date}}).to_list(None)
        
        for i in range(1, num_days + 1):
            day_str = f"{i:02d}/{target_month:02d}"
            chart_data[day_str] = {"name": str(i), "ง่วง/วูบ": 0, "หลับใน": 0, "ตาค้าง": 0}
            
        for log in logs:
            log_time = log.get("timestamp")
            if not log_time: continue
            day_str = log_time.strftime("%d/%m")
            event = log.get("event_type")
            if day_str in chart_data:
                if event == "drowsy": chart_data[day_str]["ง่วง/วูบ"] += 1
                elif event == "deep_sleep": chart_data[day_str]["หลับใน"] += 1
                elif event == "staring": chart_data[day_str]["ตาค้าง"] += 1

    elif period == "year":
        target_year = thai_now.year
        start_date = datetime(target_year, 1, 1)
        end_date = datetime(target_year + 1, 1, 1)
        
        logs = await db.logs.find({"timestamp": {"$gte": start_date, "$lt": end_date}}).to_list(None)
        month_names = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
        
        for i in range(1, 13):
            chart_data[i] = {"name": month_names[i-1], "ง่วง/วูบ": 0, "หลับใน": 0, "ตาค้าง": 0}
            
        for log in logs:
            log_time = log.get("timestamp")
            if not log_time: continue
            m = log_time.month
            event = log.get("event_type")
            if m in chart_data:
                if event == "drowsy": chart_data[m]["ง่วง/วูบ"] += 1
                elif event == "deep_sleep": chart_data[m]["หลับใน"] += 1
                elif event == "staring": chart_data[m]["ตาค้าง"] += 1

    return list(chart_data.values())