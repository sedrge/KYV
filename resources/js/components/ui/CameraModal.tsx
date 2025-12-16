import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, X } from 'lucide-react';

interface Props {
  documentType: string;
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraModal({ documentType, onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  /* ================= LOAD CAMERAS ================= */

  useEffect(() => {
    const loadDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ video: true }); // permission
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(d => d.kind === 'videoinput');

      setDevices(videoDevices);

      // priorité caméra arrière
      const backCamera =
        videoDevices.find(d =>
          /back|rear|environment/i.test(d.label)
        ) || videoDevices[0];

      setCurrentDeviceId(backCamera?.deviceId ?? null);
    };

    loadDevices();
  }, []);

  /* ================= START CAMERA ================= */

  useEffect(() => {
    const startCamera = async () => {
      if (!currentDeviceId) return;

      streamRef.current?.getTracks().forEach(t => t.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: currentDeviceId } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [currentDeviceId]);

  /* ================= SWITCH CAMERA ================= */

  const switchCamera = () => {
    if (devices.length < 2 || !currentDeviceId) return;

    const index = devices.findIndex(d => d.deviceId === currentDeviceId);
    const next = devices[(index + 1) % devices.length];

    setCurrentDeviceId(next.deviceId);
  };

  /* ================= DOCUMENT RATIO ================= */

  const aspectRatio =
    documentType === 'Passport' ? 1.42 :
    documentType === 'ID Card' ? 1.58 :
    1.6;

  /* ================= CAPTURE ================= */

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameWidth = video.videoWidth * 0.8;
    const frameHeight = frameWidth / aspectRatio;

    const sx = (video.videoWidth - frameWidth) / 2;
    const sy = (video.videoHeight - frameHeight) / 2;

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    ctx.drawImage(
      video,
      sx,
      sy,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );

    canvas.toBlob(blob => {
      if (!blob) return;
      onCapture(new File([blob], 'document.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="border-4 border-green-400 rounded-lg w-[80%]"
          style={{ aspectRatio }}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* TOP BAR */}
      <div className="absolute top-4 right-4">
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="text-white" />
        </Button>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
        <Button
          variant="secondary"
          size="icon"
          onClick={switchCamera}
        >
          <RotateCcw />
        </Button>

        <Button
          size="lg"
          disabled={!isReady}
          onClick={capture}
          className="rounded-full h-16 w-16"
        >
          <Camera />
        </Button>
      </div>
    </div>
  );
}
