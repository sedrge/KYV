import React, { useEffect, useRef, useState } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';

export default function MrzTestCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [worker, setWorker] = useState<any>(null);
  const [ocrText, setOcrText] = useState('');
  const [mrzText, setMrzText] = useState('');
  const [status, setStatus] = useState('Initialisation...');
  const [error, setError] = useState<string | null>(null);

  /* 🎥 CAMERA */
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus('Caméra prête');
        }
      } catch {
        setError('Accès caméra impossible');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(t => t.stop());
      }
    };
  }, []);

  /* 🔤 TESSERACT */
  useEffect(() => {
    const initWorker = async () => {
      const w = await createWorker(['eng']);
      await w.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      setWorker(w);
    };

    initWorker();
    return () => worker?.terminate();
  }, []);

      function normalizeMRZLine(line: string, targetLength: number): string {
      return line
        .replace(/[^A-Z0-9<]/g, '')
        .replace(/C/g, '<')     // Tesseract confusion
        .padEnd(targetLength, '<')
        .slice(0, targetLength);
    }


  /* 📸 CAPTURE + OCR */
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || !worker) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const w = video.videoWidth * 0.9;
    const h = video.videoHeight * 0.3;
    const x = (video.videoWidth - w) / 2;
    const y = video.videoHeight - h - 10;

    const scale = 2;
    canvas.width = w * scale;
    canvas.height = h * scale;

    ctx.drawImage(video, x, y, w, h, 0, 0, canvas.width, canvas.height);

    setStatus('OCR en cours...');

    const { data } = await worker.recognize(canvas);
    const text: string = data.text || '';

    setOcrText(text);

    const lines = text
      .split('\n')
      .map((l: string) => l.replace(/[^A-Z0-9<]/g, '').trim())
      .filter((l: string) => l.length >= 30 && l.includes('<'));

    if (lines.length >= 2) {
      const normalized = lines
  .slice(0, 3)
  .map((l: string) => normalizeMRZLine(l, 30))
  .join('\n');

setMrzText(normalized);

const parsed = parseMRZ(normalized);
setStatus(parsed.valid ? 'MRZ VALIDE ✅' : 'MRZ invalide ❌');

    } else {
      setMrzText('');
      setStatus('MRZ non détecté');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <video
        ref={videoRef}
        className="w-full max-w-md border rounded"
        muted
        playsInline
      />

      <button
        onClick={captureAndScan}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Capturer & Scanner MRZ
      </button>

      {/* 👁️ IMAGE CAPTURÉE */}
      <canvas
        ref={canvasRef}
        className="w-full max-w-md border-2 border-green-500"
      />

      <div className="bg-gray-100 p-3 text-sm rounded">
        <strong>OCR brut :</strong>
        <pre className="whitespace-pre-wrap">{ocrText || '—'}</pre>
      </div>

      <div className="bg-gray-100 p-3 text-sm rounded">
        <strong>MRZ :</strong>
        <pre>{mrzText || '—'}</pre>
      </div>

      <p className="font-semibold">{status}</p>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
