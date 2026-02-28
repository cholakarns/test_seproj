# --- backend/app/routers/detection.py ---
from fastapi import APIRouter, File, UploadFile
import cv2
import numpy as np
from app.services.ai_service import face_mesh, calculate_ear, LEFT_EYE, RIGHT_EYE, EYE_AR_THRESH

router = APIRouter()

@router.post("/api/detect")
async def detect_drowsiness(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"status": "error", "message": "Cannot decode image"}

        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        results = face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return {"status": "no_face", "ear": 0.0, "is_eye_closed": False, "face_box": None}

        for face_landmarks in results.multi_face_landmarks:
            landmarks = face_landmarks.landmark
            
            left_ear = calculate_ear(landmarks, LEFT_EYE, w, h)
            right_ear = calculate_ear(landmarks, RIGHT_EYE, w, h)
            avg_ear = (left_ear + right_ear) / 2.0

            x_coords = [lm.x for lm in landmarks]
            y_coords = [lm.y for lm in landmarks]
            face_box = [
                int(min(x_coords) * w), 
                int(min(y_coords) * h), 
                int((max(x_coords) - min(x_coords)) * w), 
                int((max(y_coords) - min(y_coords)) * h)
            ]

            return {
                "status": "success",
                "ear": float(round(avg_ear, 3)),
                "is_eye_closed": bool(avg_ear < EYE_AR_THRESH),
                "face_box": face_box
            }
            
    except Exception as e:
        return {"status": "error", "message": str(e)}

    return {"status": "error"}