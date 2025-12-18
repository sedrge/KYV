import React, { useRef, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';
import { Camera, RotateCcw } from 'lucide-react'; // exemple d'icône

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzCameraModal({ onResult }: { onResult: (data: MrzFields) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [worker, setWorker] = useState<any>(null);
  const [scanActive, setScanActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Init caméra + worker
    const initCamera = async () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }

        // fallback si facingMode non supporté
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: facingMode // 'user' ou 'environment'
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.error(err);
        setError('Impossible d’accéder à la caméra arrière. Essayez d’autoriser l’accès ou utilisez une autre caméra.');
      }
    };


  useEffect(() => {
    initCamera();
  }, [facingMode]);

  useEffect(() => {
    const initWorker = async () => {
      const w: any = await createWorker();
      await w.load();
      await w.loadLanguage('eng');
      await w.initialize('eng');
      await w.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        preserve_interword_spaces: '1',
      });
      setWorker(w);
    };
    initWorker();

    return () => {
      if (worker) worker.terminate();
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // OCR live
  useEffect(() => {
    if (!worker || !scanActive) return;

    let isRunning = false;

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current || isRunning) return;
      if (!videoRef.current.videoWidth) return;

      isRunning = true;

      const ctx = canvasRef.current.getContext('2d')!;
      const scale = 640 / videoRef.current.videoWidth;
      const rectWidth = videoRef.current.videoWidth * 0.8;
      const rectHeight = videoRef.current.videoHeight * 0.25;
      const rectX = (videoRef.current.videoWidth - rectWidth) / 2;
      const rectY = (videoRef.current.videoHeight - rectHeight) / 2;

      canvasRef.current.width = rectWidth * scale;
      canvasRef.current.height = rectHeight * scale;

      ctx.drawImage(
        videoRef.current,
        rectX, rectY, rectWidth, rectHeight,
        0, 0, rectWidth * scale, rectHeight * scale
      );

      try {
        const { data: { text } } = await worker.recognize(canvasRef.current);

        const mrzLines = text
          .split('\n')
          .map((l: string) => l.replace(/[^A-Z0-9<]/g, '').trim())
          .filter((l: string) => l.length > 25);

        if (mrzLines.length >= 2) {
          const mrzText = mrzLines.slice(-2).join('\n');
          const parsed = parseMRZ(mrzText);
          if (parsed.valid) {
            setScanActive(false);
            onResult(parsed.fields as MrzFields);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        isRunning = false;
        if (scanActive) requestAnimationFrame(scan);
      }
    };

    scan();
  }, [worker, scanActive]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50 space-y-4">
      {/* Bouton caméra avant/arrière */}
      <button
        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
        onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
      >
        <Camera size={24} />
      </button>

      {/* Vidéo rectangle document */}
      <div
        className="relative overflow-hidden border-2 border-green-400 rounded"
        style={{ width: '360px', height: '144px' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
        />
        {/* Ligne verte */}
        <div className="absolute top-0 h-full w-[2px] bg-green-400 animate-scan" />
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {error && <p className="text-red-600">{error}</p>}

      <style>{`
        @keyframes scan {
          0% { left: 0; }
          100% { left: 100%; }
        }
        .animate-scan {
          position: absolute;
          animation: scan 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
