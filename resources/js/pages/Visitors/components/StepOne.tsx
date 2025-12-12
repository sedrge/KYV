import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Camera, Upload } from 'lucide-react';

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
    const [ocrMessage, setOcrMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const extractDataFromText = (text: string) => {
        const extracted: Record<string, string> = {};

        const namePatterns = [
            /(?:nom|name|surname)[:\s]*([A-Z\s]+)/i,
            /^([A-Z]{2,}\s[A-Z]{2,})/,
        ];

        const documentNumberPatterns = [
            /(?:n°|no|number|numéro)[:\s]*([A-Z0-9]+)/i,
            /([A-Z]{2}[0-9]{7,10})/,
        ];

        const dateOfBirthPatterns = [
            /(?:date\s+of\s+birth|né\s+le|dob)[:\s]*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i,
            /(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/,
        ];

        const nationalityPatterns = [
            /(?:nationality|nationalité)[:\s]*([A-Z\s]+)/i,
        ];

        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match) {
                const fullName = match[1].trim().split(/\s+/);
                if (fullName.length >= 2) {
                    extracted.first_name = fullName.slice(0, -1).join(' ');
                    extracted.last_name = fullName[fullName.length - 1];
                }
                break;
            }
        }

        for (const pattern of documentNumberPatterns) {
            const match = text.match(pattern);
            if (match) {
                extracted.document_number = match[1].trim();
                break;
            }
        }

        for (const pattern of dateOfBirthPatterns) {
            const match = text.match(pattern);
            if (match) {
                const dateStr = match[1];
                const dateParts = dateStr.split(/[\/\-\.]/);
                if (dateParts.length === 3) {
                    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                    extracted.date_of_birth = formattedDate;
                }
                break;
            }
        }

        for (const pattern of nationalityPatterns) {
            const match = text.match(pattern);
            if (match) {
                extracted.nationality = match[1].trim();
                break;
            }
        }

        return extracted;
    };

    const processImage = async (file: File) => {
        setIsProcessing(true);
        setOcrMessage('Extraction des informations du document en cours...');

        try {
            const worker = await createWorker('fra+eng');
            const { data } = await worker.recognize(file);
            await worker.terminate();

            const extractedData = extractDataFromText(data.text);

            if (Object.keys(extractedData).length === 0) {
                setOcrMessage('Aucune information extraite. Veuillez remplir les champs manuellement.');
            } else {
                setOcrMessage('Informations extraites avec succès. Vérifiez et corrigez si nécessaire.');
                setFormData((prev) => ({ ...prev, ...extractedData }));
            }
        } catch (error) {
            console.error('Erreur lors de l\'extraction OCR:', error);
            setOcrMessage('Erreur lors de l\'extraction. Veuillez remplir les champs manuellement.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocumentFile(file);
            await processImage(file);
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Le prénom est obligatoire.';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Le nom de famille est obligatoire.';
        }

        if (!formData.document_type.trim()) {
            newErrors.document_type = 'Le type de document est obligatoire.';
        }

        if (!formData.document_number.trim()) {
            newErrors.document_number = 'Le numéro de document est obligatoire.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext({ ...formData, document_scan: documentFile });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
                <Label>Scan du document d'identité *</Label>
                <p className="text-sm text-muted-foreground">
                    Téléchargez ou prenez une photo de votre document d'identité pour extraire automatiquement vos informations
                </p>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Télécharger un document
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isProcessing}
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        Prendre une photo
                    </Button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {isProcessing && (
                    <div className="flex items-center gap-2">
                        <Spinner className="h-4 w-4" />
                        <span className="text-sm">Extraction en cours...</span>
                    </div>
                )}

                {ocrMessage && !isProcessing && (
                    <p className="text-sm text-muted-foreground">{ocrMessage}</p>
                )}

                {documentFile && (
                    <p className="text-sm text-green-600">
                        Document sélectionné : {documentFile.name}
                    </p>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="document_type">Type de Document *</Label>
                    <Select name="document_type" value={formData.document_type} onValueChange={(value) => handleSelectChange('document_type', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisissez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Passport">Passeport</SelectItem>
                            <SelectItem value="ID Card">Carte d'identité</SelectItem>
                            <SelectItem value="Driver License">Permis de conduire</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.document_type && <p className="text-sm text-destructive">{errors.document_type}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="document_number">Numéro de document *</Label>
                    <Input
                        id="document_number"
                        name="document_number"
                        value={formData.document_number}
                        onChange={handleChange}
                        placeholder="Sint beatae illo la"
                    />
                    {errors.document_number && <p className="text-sm text-destructive">{errors.document_number}</p>}
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
                    {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
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
                    {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
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
                    <Label htmlFor="number_of_children">Nombre d'enfants (&lt;15 ans) avec vous à l'hôtel</Label>
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

            <div className="flex justify-end gap-2">
                <Button type="button" onClick={handleNext} disabled={isProcessing}>
                    Suivant
                </Button>
            </div>
        </div>
    );
}
 