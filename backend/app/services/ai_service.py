# --- backend/app/services/ai_service.py ---
import mediapipe as mp
import numpy as np

# ==========================================
# SETUP: ระบบ AI (MediaPipe & EAR)
# ==========================================
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# จุดพิกัดตา (Landmark Indices)
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

# ค่า Threshold พื้นฐาน
EYE_AR_THRESH = 0.21 

def calculate_ear(landmarks, indices, img_w, img_h):
    """ฟังก์ชันคำนวณค่า EAR (Eye Aspect Ratio)"""
    try:
        coords = np.array([[landmarks[idx].x * img_w, landmarks[idx].y * img_h] for idx in indices])
        # ระยะแนวตั้ง
        v1 = np.linalg.norm(coords[1] - coords[5])
        v2 = np.linalg.norm(coords[2] - coords[4])
        # ระยะแนวนอน
        h = np.linalg.norm(coords[0] - coords[3])
        # สูตร EAR
        return (v1 + v2) / (2.0 * h)
    except Exception:
        return 0.0