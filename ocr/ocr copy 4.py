import os
import json
import sys
from paddleocr import PaddleOCR
from mrz.checker.td1 import TD1CodeChecker # Cartes d'identité (3 lignes)
from mrz.checker.td2 import TD2CodeChecker # Visas / Anciennes ID (2 lignes courtes)
from mrz.checker.td3 import TD3CodeChecker # Passeports (2 lignes longues)

os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'

def get_mrz_data(lines):
    """Détecte le format et parse le MRZ"""
    # Nettoyage : suppression des espaces et on garde les caractères MRZ typiques
    clean_lines = [line.replace(" ", "").upper() for line in lines if len(line.replace(" ", "")) > 10]
    
    # On cherche les lignes MRZ (commencent souvent par P, I, A, C...)
    # On prend les 2 ou 3 dernières lignes du document
    potential_mrz = clean_lines[-3:] if len(clean_lines) >= 3 else clean_lines
    
    mrz_string = "\n".join(potential_mrz)
    line_count = len(potential_mrz)
    first_line_len = len(potential_mrz[0]) if potential_mrz else 0

    try:
        # Logique de sélection du format
        if line_count == 3 and first_line_len == 30:
            checker = TD1CodeChecker(mrz_string)
        elif line_count == 2 and first_line_len == 44:
            checker = TD3CodeChecker(mrz_string)
        elif line_count == 2 and first_line_len == 36:
            checker = TD2CodeChecker(mrz_string)
        else:
            # Si PaddleOCR a raté une ligne, on teste les 2 dernières lignes seulement
            mrz_string_alt = "\n".join(potential_mrz[-2:])
            if len(potential_mrz[-2][0]) == 44:
                checker = TD3CodeChecker(mrz_string_alt)
            else:
                raise ValueError(f"Format non reconnu ({line_count} lignes, long: {first_line_len})")

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
    ocr = PaddleOCR(lang='fr', device='cpu', use_textline_orientation=True)
    results = ocr.predict(img_path)
    
    all_texts = []
    for res in results:
        if 'rec_texts' in res:
            all_texts.extend(res['rec_texts'])
    
    final_output = get_mrz_data(all_texts)
    print(json.dumps(final_output))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
