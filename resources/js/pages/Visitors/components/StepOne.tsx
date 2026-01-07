import { useRef, useState } from 'react';
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
import { Camera, Upload, Sparkles, X } from 'lucide-react';
import CameraModal from '@/components/ui/CameraModal';
import MrzCameraModal from '@/pages/MrzCameraModal';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [showCamera, setShowCamera] = useState(false);
  const [showMrz, setShowMrz] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocumentFile(file);
  };

  const handleMrzResult = (data: Record<string, any>) => {
    const mapped: Record<string, any> = {};

    if (data.document_number) mapped.document_number = data.document_number;
    if (data.surname) mapped.last_name = data.surname;
    if (data.name) mapped.first_name = data.name;
    if (data.birth_date?.length === 6) {
      const year = parseInt(data.birth_date.slice(0, 2));
      const fullYear = year > 25 ? `19${year}` : `20${year}`;
      mapped.date_of_birth = `${fullYear}-${data.birth_date.slice(
        2,
        4
      )}-${data.birth_date.slice(4, 6)}`;
    }
    if (data.nationality) mapped.nationality = data.nationality;
    if (!formData.document_type) mapped.document_type = 'Passport';

    setFormData((p) => ({ ...p, ...mapped }));
    setShowMrz(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.first_name) e.first_name = 'Champ requis';
    if (!formData.last_name) e.last_name = 'Champ requis';
    if (!formData.document_type) e.document_type = 'Champ requis';
    if (!formData.document_number) e.document_number = 'Champ requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext({ ...formData, document_scan: documentFile });
  };

  return (
    <>
      {/* CAMERA */}
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

      {/* MRZ */}
      {showMrz && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowMrz(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <MrzCameraModal onResult={handleMrzResult} />
        </div>
      )}

      {/* MAIN CARD */}
      <div className="relative overflow-hidden rounded-2xl border bg-background/80 p-6 md:p-10 shadow-xl backdrop-blur space-y-10">

        {/* Background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/30 to-emerald-400/30 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 space-y-10">

          {/* DOCUMENT */}
          <div className="group rounded-2xl border bg-muted/30 p-6 md:p-8 backdrop-blur transition hover:shadow-2xl">
            <Label className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Document d’identité
            </Label>

            <p className="text-sm text-muted-foreground mb-4">
              Téléversez ou scannez automatiquement votre document
            </p>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Télécharger
              </Button>

              <Button variant="outline" onClick={() => setShowCamera(true)}>
                <Camera className="mr-2 h-4 w-4" /> Photo
              </Button>

              <Button
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white hover:scale-[1.03]"
                onClick={() => setShowMrz(true)}
              >
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Scan MRZ
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {documentFile && (
              <p className="mt-3 text-sm text-emerald-600 font-medium">
                ✔ {documentFile.name}
              </p>
            )}
          </div>

          {/* FORM */}
          <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {[
              ['document_number', 'Numéro de document *'],
              ['first_name', 'Prénom(s) *'],
              ['last_name', 'Nom de famille *'],
              ['place_of_birth', 'Lieu de naissance'],
              ['nationality', 'Nationalité'],
              ['father_name', 'Nom du père'],
              ['mother_name', 'Nom de la mère'],
              ['profession', 'Profession'],
              ['home_address', 'Adresse'],
            ].map(([name, label]) => (
              <div key={name} className="space-y-1">
                <Label>{label}</Label>
                <Input
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-emerald-500/40"
                />
                {errors[name] && (
                  <p className="text-sm text-destructive">{errors[name]}</p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <Label>Type de document *</Label>
              <Select
                value={formData.document_type}
                onValueChange={(v) => handleSelectChange('document_type', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passport">Passeport</SelectItem>
                  <SelectItem value="ID Card">Carte d’identité</SelectItem>
                  <SelectItem value="Driver License">Permis</SelectItem>
                </SelectContent>
              </Select>
              {errors.document_type && (
                <p className="text-sm text-destructive">{errors.document_type}</p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-lg hover:scale-[1.04]"
              onClick={handleNext}
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
