# --- backend/app/services/ai_service.py ---

import numpy as np

# ===============================
# CONSTANTS
# ===============================
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]

EYE_AR_THRESH = 0.21

# ===============================
# INTERNAL CACHE
# ===============================
_face_mesh = None


def get_face_mesh():
    """
    Lazy initialization ของ MediaPipe FaceMesh
    จะถูกสร้างครั้งแรกตอนเรียกใช้เท่านั้น
    """
    global _face_mesh

    if _face_mesh is None:
        import mediapipe as mp

        _face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    return _face_mesh


def calculate_ear(landmarks, indices, img_w, img_h):
    """
    คำนวณ Eye Aspect Ratio (EAR)
    """
    try:
        coords = np.array([
            [landmarks[idx].x * img_w, landmarks[idx].y * img_h]
            for idx in indices
        ])

        # vertical distances
        v1 = np.linalg.norm(coords[1] - coords[5])
        v2 = np.linalg.norm(coords[2] - coords[4])

        # horizontal distance
        h = np.linalg.norm(coords[0] - coords[3])

        if h == 0:
            return 0.0

        return (v1 + v2) / (2.0 * h)

    except Exception:
        return 0.0