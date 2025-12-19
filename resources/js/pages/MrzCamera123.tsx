import React, { useRef, useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';
import { Camera } from 'lucide-react';

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzCameraModal({ onResult }: { onResult: (data: MrzFields) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [worker, setWorker] = useState<any>(null);
  const [scanActive, setScanActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>('Initialisation...');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Prétraitement image pour OCR
  const preprocessImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const threshold = avg > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = threshold;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  // Initialisation caméra
  const initCamera = async (deviceId?: string) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }

      let constraints: MediaStreamConstraints;
      if (deviceId) {
        constraints = { video: { deviceId: { exact: deviceId } } };
      } else {
        constraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' } };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanStatus('Positionnez le document MRZ dans le cadre');
      }
    } catch (err: any) {
      console.error(err);
      setError('Impossible d’accéder à la caméra. Vérifiez les permissions.');
    }
  };

  // Lister toutes les caméras disponibles
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInput = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoInput);
      if (videoInput.length > 0) {
        setSelectedDeviceId(videoInput[0].deviceId);
      }
    };
    fetchDevices();
  }, []);

  // Relancer caméra quand device change
  useEffect(() => {
    if (selectedDeviceId) initCamera(selectedDeviceId);
  }, [selectedDeviceId]);

  // Initialisation Tesseract.js worker
  useEffect(() => {
    const initWorker = async () => {
      const w: any = await createWorker();
      await w.load();
      await w.loadLanguage('eng');
      await w.initialize('eng');
      await w.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
        tessedit_pageseg_mode: '6',
        preserve_interword_spaces: '0',
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
    let frameCount = 0;
    let noDetectionCount = 0;

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current || isRunning) return;
      if (!videoRef.current.videoWidth) return;

      frameCount++;
      if (frameCount % 10 !== 0) {
        if (scanActive) requestAnimationFrame(scan);
        return;
      }

      isRunning = true;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      const rectWidth = video.videoWidth * 0.8;
      const rectHeight = video.videoHeight * 0.3;
      const rectX = (video.videoWidth - rectWidth) / 2;
      const rectY = (video.videoHeight - rectHeight) / 2;
      const scale = 2;
      canvas.width = rectWidth * scale;
      canvas.height = rectHeight * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(video, rectX, rectY, rectWidth, rectHeight, 0, 0, canvas.width, canvas.height);

      preprocessImage(ctx, canvas.width, canvas.height);

      try {
        const { data: { text } } = await worker.recognize(canvas);

        const mrzLines = text
          .split('\n')
          .map((l: string) => l.replace(/[^A-Z0-9<]/g, ''))
          .filter((l: string) => l.length >= 30 && l.includes('<'));

        if (mrzLines.length >= 2) {
          const mrzText = mrzLines.slice(-3).slice(0, 3).join('\n');
          const parsed = parseMRZ(mrzText);

          if (parsed.valid) {
            setScanStatus('MRZ détecté avec succès!');
            setScanActive(false);
            onResult(parsed.fields as MrzFields);
            return;
          }
        }

        noDetectionCount++;
        if (noDetectionCount > 50) setScanStatus('Aucun document détecté');
        else setScanStatus('Positionnez le document MRZ dans le cadre');

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
      {/* Bouton changer caméra */}
      {videoDevices.length > 1 && (
        <button
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          onClick={() => {
            const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
            const nextIndex = (currentIndex + 1) % videoDevices.length;
            setSelectedDeviceId(videoDevices[nextIndex].deviceId);
          }}
        >
          <Camera size={24} />
        </button>
      )}

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
        <div className="absolute top-0 h-full w-[2px] bg-green-400 animate-scan" />
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Status scan */}
      <div className="bg-white px-4 py-2 rounded shadow-md">
        <p className="text-sm font-medium">{scanStatus}</p>
      </div>

      {error && <p className="text-red-600 bg-white px-4 py-2 rounded">{error}</p>}

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
