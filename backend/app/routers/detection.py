from fastapi import APIRouter, File, UploadFile
import cv2
import numpy as np

router = APIRouter()

# cache ไว้ ไม่ต้องสร้างซ้ำทุก request
_face_mesh = None
_ai_utils = None


def get_ai():
    """
    Lazy load AI service (mediapipe, face mesh)
    จะถูกเรียกครั้งแรกตอนมี request เท่านั้น
    """
    global _face_mesh, _ai_utils

    if _face_mesh is None or _ai_utils is None:
        from app.services import ai_service

        _face_mesh = ai_service.get_face_mesh()  # ✅ ถูก
        _ai_utils = ai_service

    return _face_mesh, _ai_utils


@router.post("/api/detect")
async def detect_drowsiness(file: UploadFile = File(...)):
    try:
        # อ่านภาพ
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {
                "status": "error",
                "message": "Cannot decode image"
            }

        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 🔥 lazy load ตรงนี้
        face_mesh, ai = get_ai()

        results = face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return {
                "status": "no_face",
                "ear": 0.0,
                "is_eye_closed": False,
                "face_box": None
            }

        for face_landmarks in results.multi_face_landmarks:
            landmarks = face_landmarks.landmark

            left_ear = ai.calculate_ear(
                landmarks, ai.LEFT_EYE, w, h
            )
            right_ear = ai.calculate_ear(
                landmarks, ai.RIGHT_EYE, w, h
            )

            avg_ear = (left_ear + right_ear) / 2.0

            x_coords = [lm.x for lm in landmarks]
            y_coords = [lm.y for lm in landmarks]

            face_box = [
                int(min(x_coords) * w),
                int(min(y_coords) * h),
                int((max(x_coords) - min(x_coords)) * w),
                int((max(y_coords) - min(y_coords)) * h),
            ]

            return {
                "status": "success",
                "ear": round(float(avg_ear), 3),
                "is_eye_closed": avg_ear < ai.EYE_AR_THRESH,
                "face_box": face_box
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

    return {"status": "error"}