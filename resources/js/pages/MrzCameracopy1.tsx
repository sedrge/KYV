import React, { useRef, useEffect, useState } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzCameraModal({
  onResult,
}: {
  onResult?: (data: MrzFields) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [worker, setWorker] = useState<any>(null);
  const [status, setStatus] = useState('Initialisation…');
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     CAMERA (PC + ANDROID)
  =============================== */
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('Positionnez le MRZ dans le cadre');
      }
    } catch (e) {
      console.error(e);
      setError('Accès caméra impossible');
    }
  };

  /* ===============================
     TESSERACT v5+ (API PROPRE)
  =============================== */
  useEffect(() => {
    const initWorker = async () => {
      const w = await createWorker(['eng']);

      await w.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '0',
      });

      setWorker(w);
    };

    initCamera();
    initWorker();

    return () => {
      worker?.terminate();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===============================
     OCR LOOP (STABLE)
  =============================== */
  useEffect(() => {
    if (!worker) return;

    let running = false;
    let frameCount = 0;

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current || running) {
        requestAnimationFrame(scan);
        return;
      }

      if (!videoRef.current.videoWidth) {
        requestAnimationFrame(scan);
        return;
      }

      frameCount++;
      if (frameCount % 12 !== 0) {
        requestAnimationFrame(scan);
        return;
      }

      running = true;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      const w = video.videoWidth * 0.9;
      const h = video.videoHeight * 0.35;
      const x = (video.videoWidth - w) / 2;
      const y = video.videoHeight - h - 10;

      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(video, x, y, w, h, 0, 0, w, h);

      try {
        const { data } = await worker.recognize(canvas);
        const text = data.text || '';

        setOcrText(text);

        const lines = text
        .split('\n')
        .map((l: string) => l.replace(/[^A-Z0-9<]/g, '').trim())
        .filter((l: string) => l.includes('<') && l.length >= 30);


        if (lines.length >= 2) {
          const mrz = lines.slice(0, 2).join('\n');
          const parsed = parseMRZ(mrz);

          if (parsed.valid) {
            setStatus('MRZ VALIDE ✅');
            onResult?.(parsed.fields as MrzFields);
          } else {
            setStatus('MRZ détecté mais invalide');
          }
        } else {
          setStatus('Aucun MRZ détecté');
        }
      } catch (e) {
        console.error(e);
      } finally {
        running = false;
        requestAnimationFrame(scan);
      }
    };

    scan();
  }, [worker, onResult]);

  /* ===============================
     UI
  =============================== */
  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 p-4 z-50">
      <div className="border-2 border-green-400 w-[360px] h-[160px] rounded overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          autoPlay
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white p-3 rounded w-full max-w-md text-sm">
        <p><strong>Status :</strong> {status}</p>
        <pre className="bg-gray-100 p-2 mt-2 max-h-40 overflow-auto">
          {ocrText || '—'}
        </pre>
      </div>

      {error && (
        <p className="text-red-600 bg-white p-2 rounded">{error}</p>
      )}
    </div>
  );
}
