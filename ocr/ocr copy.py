import os
from paddleocr import PaddleOCR

# Optionnel : Désactive la vérification de connectivité au démarrage
os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'

# Initialisation simplifiée pour la version 3.0+
ocr = PaddleOCR(
    lang='fr', 
    device='cpu', 
    use_textline_orientation=True
)

img_path = 'passport.jpg'

# Dans la version 3.0, on utilise directement la méthode recommandée.
# L'argument 'cls' n'existe plus ici car l'orientation est gérée à l'init.
result = ocr.predict(img_path)

# Affichage des résultats
for res in result:
    # La structure de retour peut varier en 3.0, 
    # mais 'print' permet de voir l'objet de prédiction complet
    print(res)