import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, X } from 'lucide-react';
import cv from '@techstark/opencv-js';
import CropModal from './CropModal';

interface Props {
  documentType: string;
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);   // offscreen
  const overlayRef = useRef<HTMLCanvasElement>(null);  // visible
  const streamRef = useRef<MediaStream | null>(null);

  const detectedQuadRef = useRef<number[][] | null>(null);
  const stableQuadRef = useRef<number[][] | null>(null);
  const stableCountRef = useRef(0);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);


  /* ================= CAMERA SETUP ================= */

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter(d => d.kind === 'videoinput');
      setDevices(cams);
      const back = cams.find(d => /back|rear|environment/i.test(d.label)) || cams[0];
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

    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [currentDeviceId]);

  /* ================= INIT CANVAS ================= */

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      if (!canvasRef.current || !overlayRef.current) return;
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      overlayRef.current.width = video.videoWidth;
      overlayRef.current.height = video.videoHeight;
    };

    video.addEventListener('loadedmetadata', onLoaded);
    return () => video.removeEventListener('loadedmetadata', onLoaded);
  }, []);

  /* ================= HELPERS ================= */

  const sortQuadPoints = (quad: cv.Mat): number[][] => {
    const pts: number[][] = [];
    for (let i = 0; i < quad.total(); i++) {
      pts.push([quad.data32S[i * 2], quad.data32S[i * 2 + 1]]);
    }

    pts.sort((a, b) => a[1] - b[1]);
    const top = pts.slice(0, 2).sort((a, b) => a[0] - b[0]);
    const bottom = pts.slice(2).sort((a, b) => a[0] - b[0]);

    return [top[0], top[1], bottom[1], bottom[0]];
  };

  /* ================= LIVE OPENCV ================= */

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
      const ctx = canvas.getContext('2d')!;
      const octx = overlay.getContext('2d')!;
      octx.clearRect(0, 0, w, h);

      ctx.drawImage(video, 0, 0, w, h);

      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edges = new cv.Mat();
      const dilated = new cv.Mat();
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
      cv.Canny(blurred, edges, 60, 150);
      cv.dilate(edges, dilated, kernel);

      cv.findContours(dilated, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      let bestQuad: cv.Mat | null = null;
      let maxArea = 0;
      const minArea = w * h * 0.1;

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();

        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

        if (approx.total() === 4 && cv.isContourConvex(approx)) {
          const area = cv.contourArea(approx);
          const rect = cv.boundingRect(approx);
          const ratio = rect.width / rect.height;

          if (area > maxArea && area > minArea && ratio > 1.3 && ratio < 1.9) {
            maxArea = area;
            bestQuad?.delete();
            bestQuad = approx.clone();
          }
        }
        approx.delete();
      }

      if (bestQuad) {
        const quad = sortQuadPoints(bestQuad);
        stableCountRef.current++;

        if (stableCountRef.current > 5) {
          detectedQuadRef.current = quad;
          stableQuadRef.current = quad;
        }

        octx.strokeStyle = '#00ff99';
        octx.lineWidth = 4;
        octx.beginPath();
        quad.forEach((p, i) => i === 0 ? octx.moveTo(p[0], p[1]) : octx.lineTo(p[0], p[1]));
        octx.closePath();
        octx.stroke();

        bestQuad.delete();
      } else {
        stableCountRef.current = 0;
      }

      src.delete(); gray.delete(); blurred.delete(); edges.delete();
      dilated.delete(); kernel.delete(); contours.delete(); hierarchy.delete();

      rafId = requestAnimationFrame(processFrame);
    };

    rafId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(rafId);
  }, [ready]);

  /* ================= CAPTURE ================= */

  const capture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64 = canvas.toDataURL('image/jpeg', 0.95);

    // si live OK → auto crop
    if (stableQuadRef.current) {
      autoCropAndSave(canvas, stableQuadRef.current);
    } else {
      // fallback → recadrage semi-auto
      setCropImage(base64);
    }
  };


  const autoCropAndSave = (
    canvas: HTMLCanvasElement,
    quad: number[][]
  ) => {
    const src = cv.imread(canvas);
    const dst = new cv.Mat();
    const [tl, tr, br, bl] = quad;

    const width = Math.max(
      Math.hypot(tr[0]-tl[0], tr[1]-tl[1]),
      Math.hypot(br[0]-bl[0], br[1]-bl[1])
    );
    const height = Math.max(
      Math.hypot(bl[0]-tl[0], bl[1]-tl[1]),
      Math.hypot(br[0]-tr[0], br[1]-tr[1])
    );

    const srcMat = cv.matFromArray(4,1,cv.CV_32FC2,[
      tl[0],tl[1], tr[0],tr[1], br[0],br[1], bl[0],bl[1]
    ]);

    const dstMat = cv.matFromArray(4,1,cv.CV_32FC2,[
      0,0, width,0, width,height, 0,height
    ]);

    const M = cv.getPerspectiveTransform(srcMat,dstMat);
    cv.warpPerspective(src,dst,M,new cv.Size(width,height));

    const temp = document.createElement('canvas');
    temp.width = width;
    temp.height = height;
    cv.imshow(temp,dst);

    temp.toBlob(b=>{
      if(b) onCapture(new File([b],'document.jpg',{type:'image/jpeg'}));
    },'image/jpeg',0.95);

    src.delete(); dst.delete(); srcMat.delete(); dstMat.delete(); M.delete();
  };


  const switchCamera = () => {
    if (devices.length < 2 && !currentDeviceId) return;
    const i = devices.findIndex(d => d.deviceId === currentDeviceId);
    setCurrentDeviceId(devices[(i + 1) % devices.length].deviceId);
  };

  /* ================= UI ================= */

  return (
  <>
    {/* MODALE CAMERA */}
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full h-full sm:max-w-xl sm:h-[80vh] bg-black overflow-hidden rounded-2xl">

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* TOP BAR */}
        <div className="absolute top-3 right-3 z-20">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="text-white" />
          </Button>
        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-6 z-20">
          <Button variant="secondary" size="icon" onClick={switchCamera}>
            <RotateCcw />
          </Button>

          <Button
            size="lg"
            onClick={capture}
            className="rounded-full h-16 w-16"
          >
            <Camera />
          </Button>
        </div>
      </div>
    </div>

    {/* 🔥 MODALE DE RECADRAGE (FALLBACK) */}
    {cropImage && (
      <CropModal
        image={cropImage}
        onClose={() => setCropImage(null)}
        onConfirm={(file) => {
          onCapture(file);
          setCropImage(null);
        }}
      />
    )}
  </>
);

}
