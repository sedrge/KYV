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
import { Camera } from "lucide-react";

interface StepThreeProps {
    onPrev: () => void;
    onNext: (data: Record<string, any>) => void;
    initialData: Record<string, any>;
}

export default function StepThree({ onPrev, onNext, initialData }: StepThreeProps) {
    // ======================
    // SELFIE SYSTEM
    // ======================
    const [selfieFile, setSelfieFile] = useState<File | null>(initialData.selfie || null);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(initialData.selfie_preview || null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [faceDetectionMessage, setFaceDetectionMessage] = useState("");
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());

            if (detections.length === 0) {
                setFaceDetectionMessage("Aucun visage détecté");
            } else if (detections.length > 1) {
                setFaceDetectionMessage("Plusieurs visages détectés");
            } else {
                setFaceDetectionMessage("Visage détecté");
            }

        }, 500);
    };

    const stopCamera = () => {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
        }
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
            if (blob) {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                setSelfieFile(file);
                setSelfiePreview(URL.createObjectURL(file));
            }
        });

        stopCamera();
    };

    // ======================
    // SIGNATURE
    // ======================

    const canvasSignRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: any) => {
        setIsDrawing(true);
        const canvas = canvasSignRef.current;
        const ctx = canvas?.getContext("2d");
        ctx?.beginPath();
        ctx?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasSignRef.current;
        const ctx = canvas?.getContext("2d");
        ctx!.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx!.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasSignRef.current;
        const ctx = canvas?.getContext("2d");
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
    };

    // ======================
    // FORM STATE
    // ======================
    const [phone, setPhone] = useState(initialData.phone || "");
    const [email, setEmail] = useState(initialData.email || "");

    const [emergencyName, setEmergencyName] = useState(initialData.emergency_name || "");
    const [emergencyCode, setEmergencyCode] = useState(initialData.emergency_country_code || "+225");
    const [emergencyPhone, setEmergencyPhone] = useState(initialData.emergency_phone || "");

    // ======================
    // NEXT STEP
    // ======================
    const handleFinish = () => {
        console.log('handleFinish called');

        if (!selfieFile) {
            console.error('No selfie file');
            alert("Veuillez prendre un selfie");
            return;
        }

        const signatureCanvas = canvasSignRef.current;
        if (!signatureCanvas) {
            console.error('No signature canvas');
            alert("Veuillez signer avant de soumettre");
            return;
        }

        const signatureData = signatureCanvas.toDataURL();
        const signatureFile = dataURLtoFile(signatureData, "signature.png");

        console.log('Submitting step 3 data:', {
            phone_number: phone,
            email,
            emergency_contact_name: emergencyName,
            emergency_contact_country_code: emergencyCode,
            emergency_contact_phone: emergencyPhone,
            selfie: selfieFile,
            signature: signatureFile,
        });

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
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
    };

    return (
        <div className="space-y-8">

            {/* ======================
                SELFIE
            ====================== */}
            <div className="rounded-lg border p-4 space-y-3">
                <Label>Selfie</Label>

                {!selfieFile && (
                    <Button onClick={startCamera} disabled={!modelsLoaded}>
                        <Camera className="mr-2 h-4 w-4" /> Prendre un selfie
                    </Button>
                )}

                {selfieFile && selfiePreview && (
                    <div className="space-y-2 text-center">
                        <img
                            src={selfiePreview}
                            className="w-40 h-40 rounded-full mx-auto border-4 border-primary object-cover"
                        />
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelfieFile(null);
                                setSelfiePreview(null);
                            }}
                        >
                            Reprendre
                        </Button>
                    </div>
                )}
            </div>

            {/* ======================
                CONTACT
            ====================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                    <Label htmlFor="phone_number">Téléphone</Label>
                    <Input id="phone_number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

            </div>

            {/* ======================
                URGENCE
            ====================== */}

            <div className="rounded-lg border p-4 space-y-4">
                <Label htmlFor="emergency_contact_name">Contact d'urgence</Label>

                <Input
                    id="emergency_contact_name"
                    placeholder="Nom"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                />

                <div className="grid grid-cols-3 gap-3">
                    <Input
                        id="emergency_contact_country_code"
                        value={emergencyCode}
                        onChange={(e) => setEmergencyCode(e.target.value)}
                    />
                    <Input
                        id="emergency_contact_phone"
                        className="col-span-2"
                        placeholder="Téléphone"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                </div>
            </div>

            {/* ======================
                SIGNATURE
            ====================== */}
            <div className="space-y-2">
                <Label>Signature</Label>

                <canvas
                    ref={canvasSignRef}
                    width={400}
                    height={150}
                    className="border rounded"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                />

                <Button variant="outline" onClick={clearSignature}>
                    Effacer
                </Button>
            </div>

            {/* ======================
                ACTIONS
            ====================== */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={onPrev}>
                    Retour
                </Button>
                <Button onClick={handleFinish}>
                    Suivant
                </Button>
            </div>

            {/* ======================
                MODAL CAMERA
            ====================== */}
            <Dialog open={isModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Selfie</DialogTitle>
                        <DialogDescription>
                            Placez votre visage dans le cercle
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative">
                        <video ref={videoRef} autoPlay muted className="w-full rounded" />
                        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-56 h-56 rounded-full border-4 border-primary border-dashed"></div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">{faceDetectionMessage}</p>

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
        </div>
    );
}
