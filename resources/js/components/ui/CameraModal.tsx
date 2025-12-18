import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, X } from 'lucide-react';
import cv from '@techstark/opencv-js';


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
  const [ready, setReady] = useState(false);
  const overlayRef = useRef<HTMLCanvasElement>(null);


  /* ================= CAMERA SETUP ================= */

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter(d => d.kind === 'videoinput');

      setDevices(cams);

      const back =
        cams.find(d => /back|rear|environment/i.test(d.label)) || cams[0];

      setCurrentDeviceId(back?.deviceId ?? null);
    })();
  }, []);

  useEffect(() => {
    if (!currentDeviceId) return;

    (async () => {
      streamRef.current?.getTracks().forEach(t => t.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: currentDeviceId } },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    })();

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [currentDeviceId]);

  useEffect(() => {
  if (!ready) return;

  let rafId: number;

  const processFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (!video || !canvas || !overlay) {
      rafId = requestAnimationFrame(processFrame);
      return;
    }

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) {
      rafId = requestAnimationFrame(processFrame);
      return;
    }

    canvas.width = w;
    canvas.height = h;
    overlay.width = w;
    overlay.height = h;

    const ctx = canvas.getContext('2d')!;
    const octx = overlay.getContext('2d')!;
    octx.clearRect(0, 0, w, h);

    ctx.drawImage(video, 0, 0, w, h);

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edges = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edges, 75, 200);

    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let bestRect: cv.Rect | null = null;
    let maxArea = 0;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const rect = cv.boundingRect(cnt);
      const area = rect.width * rect.height;

      // évite les faux positifs trop petits
      if (area > maxArea && area > w * h * 0.2) {
        maxArea = area;
        bestRect = rect;
      }
    }

    // 🔥 Dessin LIVE du contour détecté
    if (bestRect) {
      octx.strokeStyle = '#00ff99';
      octx.lineWidth = 3;
      octx.strokeRect(
        bestRect.x,
        bestRect.y,
        bestRect.width,
        bestRect.height
      );
    }

    src.delete();
    gray.delete();
    blurred.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    rafId = requestAnimationFrame(processFrame);
  };

  rafId = requestAnimationFrame(processFrame);

  return () => cancelAnimationFrame(rafId);
}, [ready]);


  const switchCamera = () => {
    if (devices.length < 2 || !currentDeviceId) return;
    const i = devices.findIndex(d => d.deviceId === currentDeviceId);
    setCurrentDeviceId(devices[(i + 1) % devices.length].deviceId);
  };

  /* ================= OPENCV AUTO CAPTURE ================= */

  const capture = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(video, 0, 0);

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blurred = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
  cv.Canny(blurred, edges, 75, 200);

  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  let bestRect = null;
  let maxArea = 0;

  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);
    const rect = cv.boundingRect(cnt);
    const area = rect.width * rect.height;

    if (area > maxArea) {
      maxArea = area;
      bestRect = rect;
    }
  }

  if (!bestRect) {
    src.delete();
    return;
  }

  const cropped = ctx.getImageData(
    bestRect.x,
    bestRect.y,
    bestRect.width,
    bestRect.height
  );

  canvas.width = bestRect.width;
  canvas.height = bestRect.height;
  ctx.putImageData(cropped, 0, 0);

  canvas.toBlob(blob => {
    if (blob) {
      onCapture(new File([blob], 'document.jpg', { type: 'image/jpeg' }));
    }
  }, 'image/jpeg', 0.95);

  src.delete();
  gray.delete();
  blurred.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();
};


  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="
        relative bg-black overflow-hidden
        w-full h-full
        sm:rounded-2xl sm:max-w-xl sm:h-[80vh]
      ">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />

        <canvas
          ref={overlayRef}
          className="absolute inset-0 z-10 pointer-events-none"
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* TOP BAR */}
        <div className="absolute top-3 right-3 z-10">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="text-white" />
          </Button>
        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-10">
          <Button variant="secondary" size="icon" onClick={switchCamera}>
            <RotateCcw />
          </Button>

          <Button
            size="lg"
            disabled={!ready}
            onClick={capture}
            className="rounded-full h-16 w-16"
          >
            <Camera />
          </Button>
        </div>
      </div>
    </div>
  );
}
