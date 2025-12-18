import React, { useRef, useState } from 'react';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MrzFields | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const submit = async () => {
    if (!file) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post('/mrz/parse', formData);
      const imageUrl = data.image_url;

      // Crée le worker Tesseract.js avec la langue
      const worker = await createWorker('eng');

      // OCR de l'image via recognize
      const { data: { text } } = await worker.recognize(imageUrl);

      // Termine le worker
      await worker.terminate();

      // Extraire seulement lignes MRZ (contenant '<')
      const mrzLines = text
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.includes('<'));

      const mrzText = mrzLines.join('\n');

      const parsed = parseMRZ(mrzText);

      if (!parsed.valid) {
        setError('MRZ invalide (checksum incorrect)');
      } else {
        const fields: MrzFields = {};
        Object.entries(parsed.fields).forEach(([k, v]) => {
          fields[k] = v ?? undefined;
        });
        setResult(fields);
      }

    } catch (e) {
      console.error(e);
      setError('Erreur lors du traitement OCR');
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
        className="hidden"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={openFilePicker}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Choisir une image
      </button>

      <button
        type="button"
        disabled={!file || loading}
        onClick={submit}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {loading ? 'Scan en cours...' : 'Scanner MRZ'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
