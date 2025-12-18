import React, { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MrzFields | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preprocessImage = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Conversion en niveaux de gris et amélioration du contraste
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // Seuil adaptatif pour meilleure binarisation
      const threshold = avg > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = threshold;
    }

    ctx.putImageData(imgData, 0, 0);
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      // Augmenter la résolution pour meilleure OCR
      const scale = 2;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Interpolation de haute qualité
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Prétraitement de l'image
      preprocessImage(ctx, canvas.width, canvas.height);

      const worker: any = await createWorker('eng');

      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        tessedit_pageseg_mode: '6', // Assume a single uniform block of text
        preserve_interword_spaces: '0',
      });

      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();

      // Nettoyage et extraction des lignes MRZ
      const mrzLines = text
        .split('\n')
        .map((l: string) => l.replace(/[^A-Z0-9<]/g, ''))
        .filter((l: string) => l.length >= 30 && l.includes('<'));

      if (mrzLines.length < 2) {
        throw new Error('MRZ non détecté. Assurez-vous que la zone MRZ est bien visible et nette.');
      }

      // Prendre les 2 ou 3 dernières lignes selon le type de document
      const mrzText = mrzLines.slice(-3).slice(0, 3).join('\n');
      const parsed = parseMRZ(mrzText);

      if (!parsed.valid) {
        throw new Error('MRZ invalide. Vérifiez la qualité de l\'image et réessayez.');
      }

      setResult(parsed.fields as MrzFields);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Impossible de lire le MRZ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => e.target.files && handleFile(e.target.files[0])}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Choisir une image MRZ
      </button>

      {loading && <p>Scan MRZ en cours…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
