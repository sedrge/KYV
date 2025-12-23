import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, RefreshCw, Upload, Loader2 } from 'lucide-react';

export default function MrzCameraModal({ onResult }: { onResult: (data: any) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref pour l'upload
  
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string>('Prêt à scanner');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Initialisation caméra haute résolution
  const initCamera = async (deviceId?: string) => {
    try {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      const constraints = { 
        video: { 
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: 'environment', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
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

  // LOGIQUE COMMUNE D'ENVOI AU SERVEUR
  const sendToServer = async (file: Blob | File) => {
    setIsScanning(true);
    setScanStatus('Analyse par l\'IA en cours...');

    const formData = new FormData();
    formData.append('image', file, 'document.jpg');

    try {
      const response = await axios.post('/ocr/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 'success') {
        setScanStatus('Document validé !');
        onResult(response.data.data);
      } else {
        setScanStatus('Erreur : Zone MRZ illisible. Réessayez.');
      }
    } catch (err) {
      setScanStatus('Erreur de connexion au serveur.');
    } finally {
      setIsScanning(false);
    }
  };

  // CAPTURE VIA WEBCAM
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => blob && sendToServer(blob), 'image/jpeg', 0.95);
  };

  // GESTION UPLOAD FICHIER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) sendToServer(file);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-4 backdrop-blur-sm">
      
      {/* Sélecteur de caméra */}
      {videoDevices.length > 1 && (
        <button 
          className="mb-4 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
          onClick={() => {
            const idx = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
            setSelectedDeviceId(videoDevices[(idx + 1) % videoDevices.length].deviceId);
          }}
        >
          <RefreshCw size={24} className={isScanning ? 'animate-spin' : ''} />
        </button>
      )}

      {/* Fenêtre de scan */}
      <div className="relative overflow-hidden border-4 border-green-500 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-black"
           style={{ width: '100%', maxWidth: '500px', aspectRatio: '1.6' }}>
        
        <video ref={videoRef} className="w-full h-full object-cover" playsInline autoPlay muted />

        <div className="absolute top-0 w-full h-[3px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] animate-scan-line" />
        
        {isScanning && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 animate-spin mb-2" />
            <span className="text-sm font-medium">Traitement PaddleOCR...</span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-6 bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-4">
        <p className="text-white font-medium text-center">{scanStatus}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        {/* Bouton Camera */}
        <button
          onClick={captureAndScan}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 disabled:bg-gray-700 transition-all active:scale-95"
        >
          <Camera size={22} />
          <span>SCANNER</span>
        </button>

        {/* Bouton Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 transition-all active:scale-95"
        >
          <Upload size={22} />
          <span>IMAGE</span>
        </button>
      </div>

      {/* Input de fichier caché */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
      `}</style>
    </div>
  );
}
