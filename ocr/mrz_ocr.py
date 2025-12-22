import cv2
import sys
import re
from paddleocr import PaddleOCR

# =========================
# CONFIG
# =========================
ocr = PaddleOCR(lang="en", use_textline_orientation=False)

# =========================
# UTILS
# =========================
def is_mrz_line(text):
    """Vérifie si la ligne ressemble à une MRZ"""
    text = text.replace(" ", "")
    return "<" in text and len(text) >= 25

def parse_mrz(lines):
    """Extrait les données MRZ"""
    if len(lines) < 2:
        return None

    l1 = lines[0]
    l2 = lines[1]

    data = {}
    data["document_type"] = l1[0]
    data["issuing_country"] = l1[2:5]

    names = l1[5:].split("<<")
    data["surname"] = names[0].replace("<", "")
    data["given_names"] = names[1].replace("<", " ").strip() if len(names) > 1 else ""

    data["passport_number"] = l2[0:9].replace("<", "")
    data["nationality"] = l2[10:13]
    data["birth_date"] = l2[13:19]
    data["sex"] = l2[20]
    data["expiry_date"] = l2[21:27]

    return data

# =========================
# MAIN
# =========================
if len(sys.argv) < 2:
    print("Usage: python mrz_ocr.py passport.jpg")
    sys.exit(1)

image_path = sys.argv[1]
img = cv2.imread(image_path)

if img is None:
    print("❌ Image introuvable")
    sys.exit(1)

# =========================
# PaddleOCR
# =========================
result = ocr.ocr(image_path, cls=False)  # cls=False car on n'utilise pas l'orientation

# Collecte des lignes MRZ
mrz_candidates = []

for line in result:
    # Chaque 'line' est une liste de détections sur cette image
    for rec in line:
        text = rec[1][0].replace(" ", "")  # texte reconnu
        if is_mrz_line(text):
            mrz_candidates.append(text)

print("\n===== MRZ DÉTECTÉE =====")
for l in mrz_candidates:
    print(l)

data = parse_mrz(mrz_candidates)

print("\n===== DONNÉES EXTRAITES =====")
if data:
    for k, v in data.items():
        print(f"{k}: {v}")
else:
    print("❌ MRZ invalide ou incomplète")
