import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    onPrev: () => void;
    onConfirm: () => void;
    formData: Record<string, any>;
}

export default function StepFour({ onPrev, onConfirm, formData }: Props) {
    const [isInfoAccurate, setIsInfoAccurate] = useState(false);
    const formatDate = (date: string) => {
        if (!date) return 'Non renseigné';
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const formatTime = (time: string) => {
        if (!time) return 'Non renseigné';
        return time;
    };

    const getDocumentTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'Passport': 'Passeport',
            'ID Card': 'Carte d\'identité',
            'Driver License': 'Permis de conduire',
        };
        return types[type] || type;
    };

    const getTravelTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'International': 'International',
            'National': 'National',
        };
        return types[type] || type;
    };

    const getTravelReasonLabel = (reason: string) => {
        return reason || 'Non renseigné';
    };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">
                        Veuillez vérifier toutes vos informations avant de soumettre le formulaire
                    </p>
                </div>
            </div>

            {/* INFORMATIONS PERSONNELLES */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                    <CardDescription>Document d'identité et données personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Type de document</p>
                            <p className="text-base">{getDocumentTypeLabel(formData.document_type)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Numéro de document</p>
                            <p className="text-base font-mono">{formData.document_number || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Prénom(s)</p>
                            <p className="text-base">{formData.first_name || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nom de famille</p>
                            <p className="text-base">{formData.last_name || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                            <p className="text-base">{formatDate(formData.date_of_birth)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Lieu de naissance</p>
                            <p className="text-base">{formData.place_of_birth || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nationalité</p>
                            <p className="text-base">{formData.nationality || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Profession</p>
                            <p className="text-base">{formData.profession || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nom du père</p>
                            <p className="text-base">{formData.father_name || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nom de la mère</p>
                            <p className="text-base">{formData.mother_name || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Adresse du domicile</p>
                            <p className="text-base">{formData.home_address || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nombre d'enfants (&lt;15 ans)</p>
                            <p className="text-base">{formData.number_of_children || 0}</p>
                        </div>
                    </div>

                    {formData.document_scan && (
                        <div className="pt-2">
                            <p className="text-sm font-medium text-muted-foreground">Document scanné</p>
                            <Badge variant="secondary" className="mt-1">
                                {formData.document_scan.name}
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator />

            {/* INFORMATIONS DU VOYAGE */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informations du voyage</CardTitle>
                    <CardDescription>Détails de votre séjour</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Type de voyage</p>
                            <p className="text-base">{getTravelTypeLabel(formData.travel_type)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Motif du voyage</p>
                            <p className="text-base">{getTravelReasonLabel(formData.travel_reason)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date d'arrivée dans le pays</p>
                            <p className="text-base">{formatDate(formData.arrival_date)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Arrivée à l'hôtel</p>
                            <p className="text-base">{formatTime(formData.arrival_time)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date de sortie du pays</p>
                            <p className="text-base">{formatDate(formData.departure_date)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Départ de l'hôtel</p>
                            <p className="text-base">{formatTime(formData.departure_time)}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Prochaine destination</p>
                            <p className="text-base">{formData.next_destination || 'Non renseigné'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* INFORMATIONS DE CONTACT */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Informations de contact</CardTitle>
                    <CardDescription>Contact et personne d'urgence</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                            <p className="text-base">{formData.phone_country_code} {formData.phone_number || 'Non renseigné'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{formData.email || 'Non renseigné'}</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                        <p className="font-medium">Contact d'urgence</p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                                <p className="text-base">{formData.emergency_contact_name || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                                <p className="text-base">
                                    {formData.emergency_contact_country_code} {formData.emergency_contact_phone || 'Non renseigné'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 md:grid-cols-2">
                        {formData.selfie && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Selfie</p>
                                <img
                                    src={URL.createObjectURL(formData.selfie)}
                                    alt="Selfie"
                                    className="h-32 w-32 rounded-full border-4 border-primary object-cover"
                                />
                            </div>
                        )}
                        {formData.signature && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Signature</p>
                                <img
                                    src={URL.createObjectURL(formData.signature)}
                                    alt="Signature"
                                    className="h-32 rounded border bg-white object-contain p-2"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* CONFIRMATION DE SINCÉRITÉ */}
            <Card className="border-primary">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="info-accuracy"
                            checked={isInfoAccurate}
                            onCheckedChange={(checked) => setIsInfoAccurate(checked === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="info-accuracy"
                                className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Je certifie que toutes les informations fournies sont exactes et sincères
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                En cochant cette case, vous confirmez l'exactitude de toutes les informations saisies dans ce formulaire.
                            </p>
                        </div>
                    </div>

                    {!isInfoAccurate && (
                        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>Vous devez certifier l'exactitude des informations avant de soumettre le formulaire.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ACTIONS */}
            <div className="flex justify-between gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onPrev}>
                    Retour
                </Button>
                <Button
                    type="button"
                    onClick={onConfirm}
                    size="lg"
                    disabled={!isInfoAccurate}
                >
                    Confirmer et soumettre
                </Button>
            </div>
        </div>
    );
}
