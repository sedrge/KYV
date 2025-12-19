import React, { useEffect, useRef, useState } from "react";
import { createWorker, PSM } from "tesseract.js";
import { parse as parseMRZ } from "mrz";

export default function MrzTestCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [worker, setWorker] = useState<any>(null);
  const [ocrText, setOcrText] = useState("");
  const [mrzText, setMrzText] = useState("");
  const [status, setStatus] = useState("Initialisation...");
  const [error, setError] = useState<string | null>(null);

  /* 🎥 CAMERA */
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus("Caméra prête");
        }
      } catch {
        setError("Accès caméra impossible");
      }
    };

    initCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* 🔤 TESSERACT v5+ (CORRIGÉ) */
  useEffect(() => {
    let cancelled = false;
    let w: any = null;

    const initWorker = async () => {
      try {
        setStatus("Chargement OCR...");

        w = await createWorker();         // ✅ v5+ : pas de logger ici
        await w.load();                   // ✅ obligatoire avant loadLanguage/initialize

        // ✅ OCR-B si disponible, sinon fallback eng
        const primaryLang = "ocrb";
        const fallbackLang = "eng";

        try {
          await w.loadLanguage(primaryLang);
          await w.initialize(primaryLang);
        } catch {
          await w.loadLanguage(fallbackLang);
          await w.initialize(fallbackLang);
        }

        // ✅ Paramètres MRZ
        await w.setParameters({
          tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
          tessedit_pageseg_mode: String(PSM.SINGLE_LINE),
          user_defined_dpi: "300",
          preserve_interword_spaces: "1",
        });

        if (!cancelled) {
          setWorker(w);
          setStatus("OCR prêt");
        } else {
          await w.terminate();
        }
      } catch (e) {
        if (!cancelled) setError("Impossible d'initialiser Tesseract");
        if (w) await w.terminate();
      }
    };

    initWorker();

    return () => {
      cancelled = true;
      if (w) {
        // ✅ fermeture propre
        w.terminate();
      }
    };
  }, []);

    function preprocessCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      const v = gray > 140 ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  }

    function normalizeMRZLine(line: string, target: number) {
    return line
      .toUpperCase()
      .replace(/[^A-Z0-9<]/g, "")
      .replace(/O/g, "0")
      .replace(/I/g, "1")
      .replace(/B/g, "8")
      .replace(/S/g, "5")
      .replace(/C/g, "<")
      .padEnd(target, "<")
      .slice(0, target);
  }

    const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current || !worker) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const cropW = video.videoWidth * 0.9;
    const cropH = video.videoHeight * 0.28;
    const cropX = (video.videoWidth - cropW) / 2;
    const cropY = video.videoHeight - cropH - 20;

    const scale = 3;
    canvas.width = cropW * scale;
    canvas.height = cropH * scale;

    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    preprocessCanvas(canvas);

    setStatus("OCR MRZ…");

    const { data } = await worker.recognize(canvas);
    const raw = data?.text || "";
    setOcrText(raw);

    const lines = raw
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.includes("<"));

    if (lines.length >= 2) {
      const l1 = normalizeMRZLine(lines[0], 44);
      const l2 = normalizeMRZLine(lines[1], 44);
      const mrz = `${l1}\n${l2}`;

      setMrzText(mrz);

      try {
        const parsed = parseMRZ(mrz);
        setStatus(parsed.valid ? "MRZ VALIDE ✅" : "MRZ invalide ❌");
      } catch {
        setStatus("MRZ illisible");
      }
    } else {
      setMrzText("");
      setStatus("MRZ non détectée");
    }
  };

    return (
    <div className="p-4 space-y-4">
      <video ref={videoRef} className="w-full max-w-md border rounded" muted playsInline />

      <button onClick={captureAndScan} className="px-4 py-2 bg-black text-white rounded">
        Capturer & Scanner MRZ
      </button>

      <canvas ref={canvasRef} className="w-full max-w-md border-2 border-green-500" />

      <div className="bg-gray-100 p-3 text-sm rounded">
        <strong>OCR brut :</strong>
        <pre className="whitespace-pre-wrap">{ocrText || "—"}</pre>
      </div>

      <div className="bg-gray-100 p-3 text-sm rounded">
        <strong>MRZ :</strong>
        <pre>{mrzText || "—"}</pre>
      </div>

      <p className="font-semibold">{status}</p>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

