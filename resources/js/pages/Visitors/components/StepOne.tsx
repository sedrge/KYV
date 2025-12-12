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
import { Camera, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';

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

        // Nettoyer le texte
        const cleanText = text.replace(/\s+/g, ' ').trim();
        console.log('Texte OCR brut:', text);

        // Pattern pour le numéro de document burkinabé (Bxxxxxxxx)
        const burkinaDocPatterns = [
            /B\s*(\d{7,9})/i,
            /(?:B|8)\s*(\d{7,9})/,
            /\b[B8]\s*[12]\s*[2]\s*[8]\s*[7]\s*[2]\s*[0]\s*[7]\s*[4]\b/i,
        ];

        for (const pattern of burkinaDocPatterns) {
            const match = cleanText.match(pattern);
            if (match) {
                const numbers = match[0].replace(/[^\d]/g, '');
                if (numbers.length >= 7) {
                    extracted.document_number = 'B' + numbers;
                    extracted.document_type = 'ID Card';
                    console.log(
                        'Numéro de document trouvé:',
                        extracted.document_number,
                    );
                    break;
                }
            }
        }

        // Pattern pour le nom (Nom:)
        const lastNamePatterns = [
            /(?:Nom|NAME)[:\s]+([A-ZÀ-ÿ\s]+?)(?:\n|Pr[ée]noms?|$)/i,
            /Nom[:\s]*([A-ZÀ-ÿ]+)/i,
        ];

        for (const pattern of lastNamePatterns) {
            const match = text.match(pattern);
            if (match) {
                extracted.last_name = match[1].trim().toUpperCase();
                console.log('Nom trouvé:', extracted.last_name);
                break;
            }
        }

        // Pattern pour le prénom (Prénoms:)
        const firstNamePatterns = [
            /(?:Pr[eé]noms?|PRENOM)[:\s]+([A-ZÀ-ÿ\s]+?)(?:\n|N[ée]|Sexe|$)/i,
            /Pr[eé]noms?[:\s]*([A-ZÀ-ÿ\s]+)/i,
        ];

        for (const pattern of firstNamePatterns) {
            const match = text.match(pattern);
            if (match) {
                extracted.first_name = match[1].trim();
                console.log('Prénom trouvé:', extracted.first_name);
                break;
            }
        }

        // Pattern pour la date de naissance (Né le:)
        const dateOfBirthPatterns = [
            /N[ée]\s*(?:\(e\))?\s*le[:\s]*(\d{2})[\/\-\.\s]*(\d{2})[\/\-\.\s]*(\d{4})/i,
            /(?:Date\s+de\s+naissance|DOB|Birth)[:\s]*(\d{2})[\/\-\.\s]*(\d{2})[\/\-\.\s]*(\d{4})/i,
            /(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})\s*[àÀa]\s*/i,
        ];

        for (const pattern of dateOfBirthPatterns) {
            const match = text.match(pattern);
            if (match) {
                const day = match[1];
                const month = match[2];
                const year = match[3];
                extracted.date_of_birth = `${year}-${month}-${day}`;
                console.log(
                    'Date de naissance trouvée:',
                    extracted.date_of_birth,
                );
                break;
            }
        }

        // Pattern pour la profession
        const professionPatterns = [
            /(?:Profession|PROFESSION)[:\s]+([A-ZÀ-ÿ\s]+?)(?:\n|D[ée]livr[ée]e|$)/i,
            /Profession[:\s]*([A-ZÀ-ÿ\s]+)/i,
        ];

        for (const pattern of professionPatterns) {
            const match = text.match(pattern);
            if (match) {
                extracted.profession = match[1].trim();
                console.log('Profession trouvée:', extracted.profession);
                break;
            }
        }

        // Pattern pour la nationalité (si carte burkinabé détectée)
        if (
            extracted.document_number &&
            extracted.document_number.startsWith('B')
        ) {
            extracted.nationality = 'Burkinabé';
            console.log('Nationalité déduite: Burkinabé');
        }

        // Pattern pour le lieu de naissance
        const placeOfBirthPatterns = [
            /[àÀa]\s+([A-ZÀ-ÿ\s]+?)(?:\n|Sexe|$)/i,
            /(?:lieu\s+de\s+naissance|Place\s+of\s+Birth)[:\s]*([A-ZÀ-ÿ\s]+)/i,
        ];

        for (const pattern of placeOfBirthPatterns) {
            const match = text.match(pattern);
            if (match && !extracted.place_of_birth) {
                const place = match[1].trim();
                if (place.length > 2 && place.length < 50) {
                    extracted.place_of_birth = place;
                    console.log(
                        'Lieu de naissance trouvé:',
                        extracted.place_of_birth,
                    );
                    break;
                }
            }
        }

        console.log('Données extraites:', extracted);
        return extracted;
    };

    const processImage = async (file: File) => {
        setIsProcessing(true);
        setOcrMessage('Extraction des informations du document en cours...');

        try {
            const worker = await createWorker('fra+eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setOcrMessage(
                            `Reconnaissance en cours... ${Math.round(m.progress * 100)}%`,
                        );
                    }
                },
            });

            // Configuration pour une meilleure reconnaissance
            await worker.setParameters({
                tessedit_char_whitelist:
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸàâäçéèêëîïôöùûüÿ0123456789 :./\n-',
                tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
            });

            const { data } = await worker.recognize(file);
            await worker.terminate();

            console.log('Texte OCR complet:', data.text);

            const extractedData = extractDataFromText(data.text);

            if (Object.keys(extractedData).length === 0) {
                setOcrMessage(
                    '⚠️ Aucune information extraite. Veuillez remplir les champs manuellement.',
                );
            } else {
                const fieldsFound = Object.keys(extractedData).length;
                setOcrMessage(
                    `✅ ${fieldsFound} champ(s) extrait(s) avec succès. Vérifiez et corrigez si nécessaire.`,
                );
                setFormData((prev) => ({ ...prev, ...extractedData }));
            }
        } catch (error) {
            console.error("Erreur lors de l'extraction OCR:", error);
            setOcrMessage(
                "❌ Erreur lors de l'extraction. Veuillez remplir les champs manuellement.",
            );
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
            newErrors.document_number =
                'Le numéro de document est obligatoire.';
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
                    Téléchargez ou prenez une photo de votre document d'identité
                    pour extraire automatiquement vos informations
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
                    <p className="text-sm text-muted-foreground">
                        {ocrMessage}
                    </p>
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
                            <SelectItem value="ID Card">
                                Carte d'identité
                            </SelectItem>
                            <SelectItem value="Driver License">
                                Permis de conduire
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.document_type && (
                        <p className="text-sm text-destructive">
                            {errors.document_type}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="document_number">
                        Numéro de document *
                    </Label>
                    <Input
                        id="document_number"
                        name="document_number"
                        value={formData.document_number}
                        onChange={handleChange}
                        placeholder="Sint beatae illo la"
                    />
                    {errors.document_number && (
                        <p className="text-sm text-destructive">
                            {errors.document_number}
                        </p>
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
                        <p className="text-sm text-destructive">
                            {errors.first_name}
                        </p>
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
                        <p className="text-sm text-destructive">
                            {errors.last_name}
                        </p>
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

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isProcessing}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}
