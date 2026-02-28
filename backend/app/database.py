# --- backend/app/database.py ---
from motor.motor_asyncio import AsyncIOMotorClient

# ดึงมาจาก main.py เดิม
MONGO_URL = "mongodb://127.0.0.1:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.drowsiness_db