import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Point {
  x: number;
  y: number;
}

interface Props {
  image: string;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export default function CropModal({ image, onClose, onConfirm }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const scaleRef = useRef(1);

  const [points, setPoints] = useState<Point[] | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  /* ================= LOAD IMAGE SAFELY ================= */

  useEffect(() => {
    const img = new Image();
    img.src = image;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      imgRef.current = img;

      const maxHeight = window.innerHeight * 0.75;
      const scale = Math.min(1, maxHeight / img.height);
      scaleRef.current = scale;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      setPoints([
        { x: 60 * scale, y: 60 * scale },
        { x: canvas.width - 60 * scale, y: 60 * scale },
        { x: canvas.width - 60 * scale, y: canvas.height - 60 * scale },
        { x: 60 * scale, y: canvas.height - 60 * scale },
      ]);
    };

    return () => {
      imgRef.current = null;
    };
  }, [image]);

  /* ================= DRAW (SAFE) ================= */

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !points) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.strokeStyle = '#00ff99';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.stroke();

    points.forEach(p => {
      ctx.fillStyle = '#00ff99';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points]);

  /* ================= DRAG ================= */

  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches?.[0];

    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    };
  };

  const onDown = (e: any) => {
    if (!points) return;
    const pos = getPos(e);

    points.forEach((p, i) => {
      const dx = p.x - pos.x;
      const dy = p.y - pos.y;
      if (Math.hypot(dx, dy) < 15) setDragIndex(i);
    });
  };

  const onMove = (e: any) => {
    if (dragIndex === null || !points) return;
    const pos = getPos(e);

    setPoints(prev =>
      prev
        ? prev.map((p, i) => (i === dragIndex ? pos : p))
        : prev
    );
  };

  const onUp = () => setDragIndex(null);

  /* ================= CONFIRM ================= */

  const confirmCrop = () => {
    const img = imgRef.current;
    const pts = points;
    if (!img || !pts) return;

    const scale = scaleRef.current;

    const minX = Math.min(...pts.map(p => p.x)) / scale;
    const minY = Math.min(...pts.map(p => p.y)) / scale;
    const maxX = Math.max(...pts.map(p => p.x)) / scale;
    const maxY = Math.max(...pts.map(p => p.y)) / scale;

    const w = maxX - minX;
    const h = maxY - minY;

    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;

    out
      .getContext('2d')!
      .drawImage(img, minX, minY, w, h, 0, 0, w, h);

    out.toBlob(blob => {
      if (blob) {
        onConfirm(new File([blob], 'document.jpg', { type: 'image/jpeg' }));
      }
    }, 'image/jpeg', 0.95);
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-h-[75vh] w-auto touch-none"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      />

      <div className="mt-4 flex gap-4">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={confirmCrop}>
          Valider
        </Button>
      </div>
    </div>
  );
}
