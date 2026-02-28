# --- backend/main.py ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# นำเข้า API ที่เราแยกไว้ในโฟลเดอร์ routers
from app.routers import auth, logs, detection, admin

app = FastAPI()

# ตั้งค่า CORS
origins = [
    "http://localhost:5173",    
    "http://127.0.0.1:5173",    
    "*"                         
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ประกอบร่าง API เข้ากับ FastAPI
app.include_router(auth.router)
app.include_router(logs.router)
app.include_router(detection.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Drowsiness Detection API is Running Modularly!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)