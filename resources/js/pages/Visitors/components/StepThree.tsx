import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Phone, Mail, User, ShieldCheck, PenTool } from "lucide-react";

interface StepThreeProps {
  onPrev: () => void;
  onNext: (data: Record<string, any>) => void;
  initialData: Record<string, any>;
}

export default function StepThree({
  onPrev,
  onNext,
  initialData,
}: StepThreeProps) {
  /* ======================
     SELFIE SYSTEM
  ====================== */
  const [selfieFile, setSelfieFile] = useState<File | null>(
    initialData.selfie || null
  );
  const [selfiePreview, setSelfiePreview] = useState<string | null>(
    initialData.selfie_preview || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faceDetectionMessage, setFaceDetectionMessage] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<any>(null);

  useEffect(() => {
    loadModels();
    return () => stopCamera();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    setModelsLoaded(true);
  };

  const startCamera = async () => {
    if (!modelsLoaded) return;
    setIsModalOpen(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length === 0)
        setFaceDetectionMessage("Aucun visage détecté");
      else if (detections.length > 1)
        setFaceDetectionMessage("Plusieurs visages détectés");
      else setFaceDetectionMessage("Visage détecté");
    }, 500);
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsModalOpen(false);
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    });

    stopCamera();
  };

  /* ======================
     SIGNATURE
  ====================== */
   const canvasSignRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasSignRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const ratio = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(ratio, ratio);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#111";
    }, []);

    const getPos = (e: PointerEvent | any) => {
        const canvas = canvasSignRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDraw = (e: any) => {
        const ctx = canvasSignRef.current?.getContext("2d");
        if (!ctx) return;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasSignRef.current?.getContext("2d");
        if (!ctx) return;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const endDraw = () => setIsDrawing(false);

    const clearSignature = () => {
        const canvas = canvasSignRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


  /* ======================
     FORM STATE
  ====================== */
  const [phone, setPhone] = useState(initialData.phone || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [emergencyName, setEmergencyName] = useState(
    initialData.emergency_name || ""
  );
  const [emergencyCode, setEmergencyCode] = useState(
    initialData.emergency_country_code || "+225"
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    initialData.emergency_phone || ""
  );

  const handleFinish = () => {
    if (!selfieFile) return alert("Veuillez prendre un selfie");
    const canvas = canvasSignRef.current;
    if (!canvas) return alert("Veuillez signer");

    const signatureFile = dataURLtoFile(
      canvas.toDataURL(),
      "signature.png"
    );

    onNext({
      phone_number: phone,
      email,
      emergency_contact_name: emergencyName,
      emergency_contact_country_code: emergencyCode,
      emergency_contact_phone: emergencyPhone,
      selfie: selfieFile,
      signature: signatureFile,
    });
  };

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++)
      u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      {/* MAIN CARD */}
      <div className="relative overflow-hidden rounded-2xl border bg-background/80 p-6 md:p-10 shadow-xl backdrop-blur space-y-10">

        {/* Glow */}
        <div className="absolute -top-24 -left-24 h-72 w-72 bg-gradient-to-br from-emerald-400/30 to-blue-500/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 space-y-10">

          {/* SELFIE */}
          <div className="rounded-2xl border bg-muted/30 p-6 text-center space-y-4">
            <Label className="flex justify-center items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Vérification d’identité
            </Label>

            {!selfieFile ? (
              <Button
                onClick={startCamera}
                disabled={!modelsLoaded}
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white"
              >
                <Camera className="mr-2 h-4 w-4" />
                Prendre un selfie
              </Button>
            ) : (
              <div className="space-y-3">
                <img
                  src={selfiePreview!}
                  className="mx-auto h-40 w-40 rounded-full border-4 border-emerald-500 object-cover"
                />
                <Button variant="outline" onClick={() => setSelfieFile(null)}>
                  Reprendre
                </Button>
              </div>
            )}
          </div>

          {/* CONTACT */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </div>

          {/* URGENCE */}
          <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
            <Label>Contact d’urgence</Label>
            <Input placeholder="Nom complet" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Input value={emergencyCode} onChange={(e) => setEmergencyCode(e.target.value)} />
              <Input className="col-span-2" placeholder="Téléphone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="space-y-2">
                <Label>Signature</Label>
                <canvas
                    ref={canvasSignRef}
                    className="w-full h-[150px] border rounded bg-white touch-none"
                    onPointerDown={startDraw}
                    onPointerMove={draw}
                    onPointerUp={endDraw}
                    onPointerLeave={endDraw}
                />
                <Button variant="outline" onClick={clearSignature}>Effacer</Button>
            </div>


          {/* ACTIONS */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrev}>
              ← Retour
            </Button>
            <Button
              onClick={handleFinish}
              className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 text-white hover:scale-[1.04]"
            >
              Terminer →
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL CAMERA */}
      <Dialog open={isModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Selfie</DialogTitle>
            <DialogDescription>
              Placez votre visage dans le cercle
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <video ref={videoRef} autoPlay muted className="rounded-xl w-full" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-56 w-56 rounded-full border-4 border-emerald-500 border-dashed animate-pulse" />
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {faceDetectionMessage}
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={stopCamera}>
              Annuler
            </Button>
            <Button
              onClick={captureSelfie}
              disabled={!faceDetectionMessage.includes("Visage détecté")}
            >
              <Camera className="mr-2 h-4 w-4" /> Capturer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
