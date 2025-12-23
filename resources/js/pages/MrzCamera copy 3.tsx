import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, RefreshCw } from 'lucide-react';

interface MrzFields {
  [key: string]: string | undefined;
}

export default function MrzCameraModal({ onResult }: { onResult: (data: any) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>('Prêt à scanner');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Initialisation caméra   width: 1280, height: 720 
  const initCamera = async (deviceId?: string) => {
    try {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      const constraints = deviceId 
        ? { video: { deviceId: { exact: deviceId } } }
        : { video: { facingMode: 'environment', width: 1920, height: 1080 } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Erreur caméra : Vérifiez les permissions.');
    }
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInput = devices.filter(d => d.kind === 'videoinput');
      setVideoDevices(videoInput);
      if (videoInput.length > 0) setSelectedDeviceId(videoInput[0].deviceId);
    });
  }, []);

  useEffect(() => {
    initCamera(selectedDeviceId || undefined);
  }, [selectedDeviceId]);

  // FONCTION CLÉ : Capture l'image et l'envoie au serveur
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setScanStatus('Analyse par l\'IA en cours...');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // On capture la frame actuelle
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Conversion en Blob pour l'envoi
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('image', blob, 'scan.jpg');

      try {
        // APPEL À  L'API LARAVEL
        const response = await axios.post('/ocr/process', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 'success') {
          setScanStatus('Document validé !');
          onResult(response.data.data); // Renvoie le JSON structuré
        } else {
          setScanStatus('Erreur : Zone MRZ illisible. Réessayez.');
        }
      } catch (err) {
        setScanStatus('Erreur de connexion au serveur.');
      } finally {
        setIsScanning(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-50 p-4">
      
      {/* Sélecteur de caméra */}
      {videoDevices.length > 1 && (
        <button 
          className="mb-4 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
          onClick={() => {
            const idx = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
            setSelectedDeviceId(videoDevices[(idx + 1) % videoDevices.length].deviceId);
          }}
        >
          <RefreshCw size={24} />
        </button>
      )}

      {/* Fenêtre de scan avec l'animation */}
      <div className="relative overflow-hidden border-4 border-green-500 rounded-xl shadow-2xl bg-black"
           style={{ width: '100%', maxWidth: '500px', aspectRatio: '1.6' }}>
        
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline autoPlay muted
        />

        {/* L'animation de la barre de scan qui descend (simulé) */}
        <div className="absolute top-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] animate-scan-line" />
        
        {/* Overlay d'analyse */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Status et Bouton Action */}
      <div className="mt-6 flex flex-col items-center space-y-4 w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg">
          <p className="text-gray-800 font-bold text-center">{scanStatus}</p>
        </div>

        <button
          onClick={captureAndScan}
          disabled={isScanning}
          className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white transition-all ${
            isScanning ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-500 active:scale-95'
          }`}
        >
          <Camera size={24} />
          <span>{isScanning ? 'ANALYSE...' : 'SCANNER MAINTENANT'}</span>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
