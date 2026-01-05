import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Camera, Upload, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import CameraModal from '@/components/ui/CameraModal';
import MrzCamera from '@/pages/MrzCamera';

interface Props {
  onNext: (data: Record<string, any>) => void;
  initialData: Record<string, any>;
}

export default function StepOne({ onNext, initialData }: Props) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    date_of_birth: initialData.date_of_birth || '',
    place_of_birth: initialData.place_of_birth || '',
    father_name: initialData.father_name || '',
    mother_name: initialData.mother_name || '',
    profession: initialData.profession || '',
    home_address: initialData.home_address || '',
    number_of_children: initialData.number_of_children || 0,
    document_type: initialData.document_type || '',
    document_number: initialData.document_number || '',
    nationality: initialData.nationality || '',
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [showMrz, setShowMrz] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocumentFile(file);
  };

  const handleMrzResult = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setShowMrz(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name) newErrors.first_name = 'Champ requis';
    if (!formData.last_name) newErrors.last_name = 'Champ requis';
    if (!formData.document_type) newErrors.document_type = 'Champ requis';
    if (!formData.document_number) newErrors.document_number = 'Champ requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext({ ...formData, document_scan: documentFile });
  };

  return (
    <>
      {showCamera && (
        <CameraModal
          documentType={formData.document_type}
          onClose={() => setShowCamera(false)}
          onCapture={(file) => {
            setDocumentFile(file);
            setShowCamera(false);
          }}
        />
      )}

      {showMrz && (
        <MrzCamera
          onClose={() => setShowMrz(false)}
          onResult={handleMrzResult}
        />
      )}

      <div className="space-y-8">
        {/* DOCUMENT CARD */}
        <div className="rounded-xl border bg-muted/20 p-6 space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Document d’identité
            </Label>
            <p className="text-sm text-muted-foreground">
              Téléversez ou scannez automatiquement votre document
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger
            </Button>

            <Button variant="outline" onClick={() => setShowCamera(true)}>
              <Camera className="mr-2 h-4 w-4" />
              Prendre une photo
            </Button>

            <Button
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90"
              onClick={() => setShowMrz(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Scan intelligent (MRZ)
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm">
              <Spinner className="h-4 w-4" />
              Traitement du document…
            </div>
          )}

          {documentFile && (
            <p className="text-sm text-green-600">
              ✔ {documentFile.name}
            </p>
          )}
        </div>

        {/* FORM */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* champs identiques à ton code */}
          {/* inchangés volontairement */}
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={handleNext}>
            Continuer
          </Button>
        </div>
      </div>
    </>
  );
}
