# Face-API.js Models

Ce répertoire doit contenir les modèles pré-entraînés pour face-api.js.

## Téléchargement des modèles

Téléchargez les modèles suivants depuis le dépôt GitHub face-api.js :
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Fichiers nécessaires :
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2

## Installation rapide

Vous pouvez également utiliser npm pour copier les modèles :

```bash
npx degit justadudewhohacks/face-api.js/weights public/models
```

Ou manuellement via curl/wget :

```bash
cd public/models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```
