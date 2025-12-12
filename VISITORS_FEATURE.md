# Fonctionnalité Gestion des Visiteurs

Cette fonctionnalité permet d'enregistrer les visiteurs avec un formulaire multi-étape incluant l'extraction automatique des informations via OCR et la détection faciale.

## Caractéristiques

### 📝 Formulaire multi-étape (3 étapes)

#### Étape 1 : Scan du document et informations personnelles
- **Scan du document d'identité** avec deux options :
  - 📷 **Prendre une photo** : Ouvre directement la caméra du dispositif (mobile/tablette)
  - 📤 **Télécharger un document** : Permet de sélectionner un fichier depuis l'appareil
- **Extraction automatique OCR** (via Tesseract.js) :
  - Nom et prénom
  - Numéro de document
  - Date de naissance
  - Nationalité
- **Champs éditables** : Tous les champs pré-remplis peuvent être corrigés manuellement
- Champs obligatoires : Type de document, Numéro de document, Prénom, Nom

#### Étape 2 : Informations du voyage
- Type de voyage (International/National)
- Dates et heures d'arrivée/départ
- Motif du voyage
- Prochaine destination

#### Étape 3 : Contact, selfie et signature
- **Détection faciale en temps réel** (via face-api.js) :
  - Messages guidant l'utilisateur (position, distance)
  - Vérification que le visage est centré et bien détecté
  - Capture automatique uniquement si tout est correct
- Informations de contact et personne à prévenir en cas d'urgence
- Canvas de signature numérique
- Confirmation des données

## Installation

### 1. Dépendances déjà installées
```bash
npm install tesseract.js face-api.js
```

### 2. Télécharger les modèles face-api.js

Les modèles pré-entraînés doivent être téléchargés dans `public/models/`.

#### Option 1 : Téléchargement automatique
```bash
npx degit justadudewhohacks/face-api.js/weights public/models
```

#### Option 2 : Téléchargement manuel
Téléchargez les fichiers suivants depuis https://github.com/justadudewhohacks/face-api.js/tree/master/weights :

- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

Placez-les dans le dossier `public/models/`.

### 3. Migrer la base de données
```bash
php artisan migrate
```

### 4. Compiler les assets
```bash
npm run build
# ou pour le mode développement
npm run dev
```

## Utilisation

1. Accédez à la page des visiteurs : `/visitors`
2. Cliquez sur "Nouveau visiteur"
3. Suivez les 3 étapes du formulaire :
   - Scannez ou uploadez le document d'identité
   - Renseignez les informations du voyage
   - Prenez un selfie et signez

## Routes disponibles

- `GET /visitors` - Liste des visiteurs
- `GET /visitors/create` - Formulaire de création
- `POST /visitors` - Enregistrement d'un visiteur
- `GET /visitors/{visitor}` - Détails d'un visiteur
- `GET /visitors/{visitor}/edit` - Formulaire d'édition
- `PUT /visitors/{visitor}` - Mise à jour d'un visiteur
- `DELETE /visitors/{visitor}` - Suppression d'un visiteur

## Tests

Des tests Pest complets ont été créés pour valider la fonctionnalité :

```bash
php artisan test --filter=VisitorTest
```

## Notes techniques

### OCR (Tesseract.js)
- Supporte le français et l'anglais
- Extraction automatique basée sur des patterns regex
- Gère les différents formats de date

### Détection faciale (face-api.js)
- Utilise TinyFaceDetector pour de meilleures performances
- Détecte les landmarks faciaux
- Vérifie le centrage et la distance du visage

### Stockage des fichiers
- Documents : `storage/app/public/visitors/documents/`
- Selfies : `storage/app/public/visitors/selfies/`
- Signatures : Encodées en base64 dans la base de données

## Améliorations possibles

- Ajouter plus de patterns pour l'extraction OCR
- Implémenter la reconnaissance faciale pour éviter les doublons
- Ajouter un système de QR code pour les visiteurs
- Exporter les données en PDF
- Notifications par email/SMS aux visiteurs
