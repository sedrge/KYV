import os
import sys
import io
import json
import logging

# --- CONFIGURATION ENVIRONNEMENT (CRUCIAL POUR LARAVEL/WINDOWS) ---
os.environ['FORK_HANDLE_REINIT'] = '1'
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'
os.environ['FLAGS_allocator_strategy'] = 'auto_growth'

# Force l'UTF-8 pour la communication avec PHP
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Silencer les logs Paddle
logging.getLogger("ppocr").setLevel(logging.ERROR)

from paddleocr import PaddleOCR
from mrz.checker.td1 import TD1CodeChecker
from mrz.checker.td2 import TD2CodeChecker
from mrz.checker.td3 import TD3CodeChecker

def get_mrz_data(lines):
    """Détecte le format et parse le MRZ"""
    # Nettoyage : suppression des espaces et filtrage des lignes trop courtes
    clean_lines = [line.replace(" ", "").upper() for line in lines if len(line.replace(" ", "")) > 10]
    
    # On prend les 3 dernières lignes (zone MRZ classique)
    potential_mrz = clean_lines[-3:] if len(clean_lines) >= 3 else clean_lines
    
    if not potential_mrz:
        return {"status": "error", "message": "Aucun texte détecté"}

    mrz_string = "\n".join(potential_mrz)
    line_count = len(potential_mrz)
    first_line_len = len(potential_mrz[0]) if potential_mrz else 0

    try:
        if line_count == 3 and first_line_len == 30:
            checker = TD1CodeChecker(mrz_string)
        elif line_count == 2 and first_line_len == 44:
            checker = TD3CodeChecker(mrz_string)
        elif line_count == 2 and first_line_len == 36:
            checker = TD2CodeChecker(mrz_string)
        else:
            # Fallback : tester les 2 dernières lignes si la détection est partielle (cas TD3)
            if line_count >= 2 and len(potential_mrz[-2]) == 44:
                mrz_string_alt = "\n".join(potential_mrz[-2:])
                checker = TD3CodeChecker(mrz_string_alt)
            else:
                raise ValueError(f"Format non reconnu ({line_count} lignes, longueur: {first_line_len})")

        fields = checker.fields()
        return {
            "status": "success",
            "type": checker.__class__.__name__,
            "data": {
                "document_type": fields.document_type,
                "country": fields.country,             
                "surname": getattr(fields, 'surname', ''),
                "name": getattr(fields, 'name', ''),
                "document_number": fields.document_number,
                "nationality": fields.nationality,
                "birth_date": fields.birth_date,
                "expiry_date": fields.expiry_date,
                "sex": fields.sex
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e), "raw_lines": potential_mrz}

def main(img_path):
    try:
        # Initialisation PaddleOCR
        ocr = PaddleOCR(lang='fr', device='cpu', use_textline_orientation=True)
        
        # Exécution de la prédiction
        results = ocr.predict(img_path)
        
        all_texts = []
        for res in results:
            if 'rec_texts' in res:
                all_texts.extend(res['rec_texts'])
        
        final_output = get_mrz_data(all_texts)
        # Sortie JSON propre sans caractères ASCII échappés
        print(json.dumps(final_output, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # sys.argv[1] contient le chemin de l'image transmis par Laravel
        main(sys.argv[1])
