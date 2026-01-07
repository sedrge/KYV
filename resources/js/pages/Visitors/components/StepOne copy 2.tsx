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
import { useRef, useState } from 'react';
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
    // Mapper les données MRZ vers les champs du formulaire
    const mappedData: Record<string, any> = {};

    if (data.document_number) mappedData.document_number = data.document_number;
    if (data.surname) mappedData.last_name = data.surname;
    if (data.name) mappedData.first_name = data.name;
    if (data.birth_date) {
      // Formater la date de naissance (YYMMDD -> YYYY-MM-DD)
      const birthDate = data.birth_date;
      if (birthDate.length === 6) {
        const year = parseInt(birthDate.substring(0, 2));
        const fullYear = year > 25 ? `19${birthDate.substring(0, 2)}` : `20${birthDate.substring(0, 2)}`;
        mappedData.date_of_birth = `${fullYear}-${birthDate.substring(2, 4)}-${birthDate.substring(4, 6)}`;
      }
    }
    if (data.nationality) mappedData.nationality = data.nationality;
    if (data.country) mappedData.nationality = data.country;

    // Définir le type de document si ce n'est pas déjà fait
    if (!formData.document_type) {
      mappedData.document_type = 'Passport'; // Par défaut pour MRZ
    }

    setFormData((prev) => ({ ...prev, ...mappedData }));
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
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setShowMrz(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <MrzCameraModal onResult={handleMrzResult} />
        </div>
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
          <div className="space-y-2">
            <Label htmlFor="document_type">Type de Document *</Label>
            <Select
              name="document_type"
              value={formData.document_type}
              onValueChange={(value) =>
                handleSelectChange('document_type', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisissez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Passport">Passeport</SelectItem>
                <SelectItem value="ID Card">Carte d'identité</SelectItem>
                <SelectItem value="Driver License">Permis de conduire</SelectItem>
              </SelectContent>
            </Select>
            {errors.document_type && (
              <p className="text-sm text-destructive">{errors.document_type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_number">Numéro de document *</Label>
            <Input
              id="document_number"
              name="document_number"
              value={formData.document_number}
              onChange={handleChange}
              placeholder="Ex: B12345678"
            />
            {errors.document_number && (
              <p className="text-sm text-destructive">{errors.document_number}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom(s) *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Inscrivez votre prénom"
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nom de famille *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Inscrivez votre nom de famille"
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place_of_birth">Lieu de naissance</Label>
            <Input
              id="place_of_birth"
              name="place_of_birth"
              value={formData.place_of_birth}
              onChange={handleChange}
              placeholder="Inscrivez votre lieu de naissance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Choisissez votre nationalité"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="father_name">Nom du père</Label>
            <Input
              id="father_name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Inscrivez le nom de votre père"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mother_name">Nom de la mère</Label>
            <Input
              id="mother_name"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              placeholder="Inscrivez le nom de votre mère"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder="Inscrivez votre profession"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home_address">Adresse du domicile</Label>
            <Input
              id="home_address"
              name="home_address"
              value={formData.home_address}
              onChange={handleChange}
              placeholder="Inscrivez votre adresse"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number_of_children">
              Nombre d'enfants (&lt;15 ans) avec vous à l'hôtel
            </Label>
            <Input
              id="number_of_children"
              name="number_of_children"
              type="number"
              min="0"
              value={formData.number_of_children}
              onChange={handleChange}
            />
          </div>
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
