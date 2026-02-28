# SE4AI_drowsiness-project

ส่วนที่ 1: การ Clone โค้ดและติดตั้งไลบรารี
ให้เพื่อนเปิด Terminal หรือ Command Prompt ในโฟลเดอร์ที่อยากเก็บงาน แล้วรันคำสั่งตามนี้ครับ:

1. ดึงโค้ดลงเครื่อง

git clone https://github.com/jirachotpi/SE4AI_drowsiness-project.git

cd SE4AI_drowsiness-project

3. ติดตั้งฝั่ง Frontend (React)

cd frontend
npm install

4. ติดตั้งฝั่ง Backend (Python)
เปิด Terminal อีกหน้านึง (หรือกลับไปที่โฟลเดอร์โปรเจกต์หลัก) แล้วทำตามนี้:

cd backend

py -3.11 -m venv venv

# เปิดใช้งาน Virtual Environment (สำหรับ Windows)
.\venv\Scripts\activate

# ติดตั้งไลบรารีทั้งหมดที่ระบุไว้ใน requirements.txt

pip install -r requirements.txt



Terminal 1 (Frontend): cd frontend -> npm run dev (หรือ npm start)

Terminal 2 (Backend): cd backend -> .\venv\Scripts\activate -> uvicorn main:app --reload
