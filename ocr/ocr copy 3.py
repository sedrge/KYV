import os
import json
import sys
from paddleocr import PaddleOCR
from mrz.checker.td3 import TD3CodeChecker # TD3 est le standard Passeport

# Désactiver les logs pour ne pas polluer la sortie JSON
os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'

def process_passport(img_path):
    ocr = PaddleOCR(lang='fr', device='cpu', use_textline_orientation=True)
    results = ocr.predict(img_path)
    
    mrz_lines = []
    for res in results:
        if 'rec_texts' in res:
            # On récupère les 3 dernières lignes (généralement le MRZ est en bas)
            mrz_lines = res['rec_texts'][-3:]
    
    # Nettoyage rapide des lignes (enlever espaces éventuels)
    mrz_lines = [line.replace(" ", "") for line in mrz_lines]
    
    try:
        # On joint les lignes avec des sauts de ligne pour le checker MRZ
        mrz_data = "\n".join(mrz_lines)
        checker = TD3CodeChecker(mrz_data)
        fields = checker.fields()
        
        # Préparation de la réponse structurée
        output = {
            "status": "success",
            "data": {
                "surname": fields.surname,
                "name": fields.name,
                "country": fields.country,
                "nationality": fields.nationality,
                "birth_date": fields.birth_date, # Format YYMMDD
                "expiry_date": fields.expiry_date,
                "sex": fields.sex,
                "document_number": fields.document_number
            }
        }
    except Exception as e:
        output = {
            "status": "error",
            "message": str(e),
            "raw_lines": mrz_lines
        }

    # IMPORTANT : On n'affiche que le JSON final
    print(json.dumps(output))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_passport(sys.argv[1])
