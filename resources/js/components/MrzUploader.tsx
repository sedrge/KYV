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

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        const v = avg > 140 ? 255 : 0;
        imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v;
      }
      ctx.putImageData(imgData, 0, 0);

      // ✅ createWorker TS-safe
      const worker: any = await createWorker(); // cast en any pour supprimer les erreurs TS
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        preserve_interword_spaces: '1',
      });

      const { data: { text } } = await worker.recognize(canvas);
      await worker.terminate();

      // ✅ typage explicite pour map()
      const mrzLines = text
        .split('\n')
        .map((l: string) => l.replace(/[^A-Z0-9<]/g, '').trim())
        .filter((l: string) => l.length > 25);

      if (mrzLines.length < 2) throw new Error('MRZ non détecté, essayez une meilleure photo');

      const mrzText = mrzLines.slice(-2).join('\n');
      const parsed = parseMRZ(mrzText);

      if (!parsed.valid) throw new Error('MRZ invalide (checksum incorrect)');

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
