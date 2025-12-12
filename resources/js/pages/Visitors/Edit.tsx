import {
    index,
    update,
} from '@/actions/App/Http/Controllers/VisitorController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Visitor {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
    place_of_birth: string | null;
    father_name: string | null;
    mother_name: string | null;
    profession: string | null;
    home_address: string | null;
    number_of_children: number | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_country_code: string | null;
    phone_number: string | null;
    phone_country_code: string | null;
    email: string | null;
    travel_type: string | null;
    document_type: string;
    document_number: string;
    nationality: string | null;
    document_scan_path: string | null;
    selfie_path: string | null;
    signature_path: string | null;
    arrival_date: string | null;
    arrival_time: string | null;
    departure_date: string | null;
    departure_time: string | null;
    travel_reason: string | null;
    next_destination: string | null;
}

interface Props {
    visitor: Visitor;
}

const breadcrumbs = (visitor: Visitor): BreadcrumbItem[] => [
    {
        title: 'Visiteurs',
        href: index().url,
    },
    {
        title: `${visitor.first_name} ${visitor.last_name}`,
        href: '#',
    },
];

export default function Edit({ visitor }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(visitor)}>
            <Head
                title={`Modifier ${visitor.first_name} ${visitor.last_name}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Modifier {visitor.first_name} {visitor.last_name}
                        </h1>
                        <p className="text-muted-foreground">
                            Modifier les informations du visiteur
                        </p>
                    </div>
                </div>

                <Form
                    {...update.form(visitor.id)}
                    encType="multipart/form-data"
                >
                    {({ errors, processing }) => (
                        <div className="space-y-4">
                            {/* INFORMATIONS PERSONNELLES */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Informations personnelles
                                    </CardTitle>
                                    <CardDescription>
                                        Document d'identité et données
                                        personnelles
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="document_type">
                                                Type de document *
                                            </Label>
                                            <Select
                                                name="document_type"
                                                defaultValue={
                                                    visitor.document_type
                                                }
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Passport">
                                                        Passeport
                                                    </SelectItem>
                                                    <SelectItem value="ID Card">
                                                        Carte d'identité
                                                    </SelectItem>
                                                    <SelectItem value="Driver License">
                                                        Permis de conduire
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.document_type}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="document_number">
                                                Numéro de document *
                                            </Label>
                                            <Input
                                                id="document_number"
                                                name="document_number"
                                                defaultValue={
                                                    visitor.document_number
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.document_number}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                Prénom(s) *
                                            </Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                defaultValue={
                                                    visitor.first_name
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.first_name}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Nom de famille *
                                            </Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                defaultValue={visitor.last_name}
                                                required
                                            />
                                            <InputError
                                                message={errors.last_name}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_of_birth">
                                                Date de naissance
                                            </Label>
                                            <Input
                                                id="date_of_birth"
                                                name="date_of_birth"
                                                type="date"
                                                defaultValue={
                                                    visitor.date_of_birth || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.date_of_birth}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="place_of_birth">
                                                Lieu de naissance
                                            </Label>
                                            <Input
                                                id="place_of_birth"
                                                name="place_of_birth"
                                                defaultValue={
                                                    visitor.place_of_birth || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.place_of_birth}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nationality">
                                                Nationalité
                                            </Label>
                                            <Input
                                                id="nationality"
                                                name="nationality"
                                                defaultValue={
                                                    visitor.nationality || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.nationality}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="profession">
                                                Profession
                                            </Label>
                                            <Input
                                                id="profession"
                                                name="profession"
                                                defaultValue={
                                                    visitor.profession || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.profession}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="father_name">
                                                Nom du père
                                            </Label>
                                            <Input
                                                id="father_name"
                                                name="father_name"
                                                defaultValue={
                                                    visitor.father_name || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.father_name}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mother_name">
                                                Nom de la mère
                                            </Label>
                                            <Input
                                                id="mother_name"
                                                name="mother_name"
                                                defaultValue={
                                                    visitor.mother_name || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.mother_name}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="home_address">
                                                Adresse du domicile
                                            </Label>
                                            <Input
                                                id="home_address"
                                                name="home_address"
                                                defaultValue={
                                                    visitor.home_address || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.home_address}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_children">
                                                Nombre d'enfants (&lt;15 ans)
                                            </Label>
                                            <Input
                                                id="number_of_children"
                                                name="number_of_children"
                                                type="number"
                                                min="0"
                                                defaultValue={
                                                    visitor.number_of_children ||
                                                    0
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.number_of_children
                                                }
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="document_scan">
                                            Scan du document
                                        </Label>
                                        {visitor.document_scan_path && (
                                            <div className="mb-2">
                                                <img
                                                    src={`/storage/${visitor.document_scan_path}`}
                                                    alt="Document actuel"
                                                    className="h-32 rounded border object-cover"
                                                />
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Document actuel -
                                                    Téléchargez un nouveau
                                                    fichier pour le remplacer
                                                </p>
                                            </div>
                                        )}
                                        <Input
                                            id="document_scan"
                                            name="document_scan"
                                            type="file"
                                            accept="image/*,.pdf"
                                        />
                                        <InputError
                                            message={errors.document_scan}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* INFORMATIONS DU VOYAGE */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Informations du voyage
                                    </CardTitle>
                                    <CardDescription>
                                        Détails du séjour
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="travel_type">
                                                Type de voyage
                                            </Label>
                                            <Select
                                                name="travel_type"
                                                defaultValue={
                                                    visitor.travel_type ||
                                                    undefined
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="International">
                                                        International
                                                    </SelectItem>
                                                    <SelectItem value="National">
                                                        National
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.travel_type}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="travel_reason">
                                                Motif du voyage
                                            </Label>
                                            <Input
                                                id="travel_reason"
                                                name="travel_reason"
                                                defaultValue={
                                                    visitor.travel_reason || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.travel_reason}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="arrival_date">
                                                Date d'arrivée dans le pays
                                            </Label>
                                            <Input
                                                id="arrival_date"
                                                name="arrival_date"
                                                type="date"
                                                defaultValue={
                                                    visitor.arrival_date || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.arrival_date}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="arrival_time">
                                                Arrivée à l'hôtel
                                            </Label>
                                            <Input
                                                id="arrival_time"
                                                name="arrival_time"
                                                type="time"
                                                defaultValue={
                                                    visitor.arrival_time || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.arrival_time}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="departure_date">
                                                Date de sortie du pays
                                            </Label>
                                            <Input
                                                id="departure_date"
                                                name="departure_date"
                                                type="date"
                                                defaultValue={
                                                    visitor.departure_date || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.departure_date}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="departure_time">
                                                Départ de l'hôtel
                                            </Label>
                                            <Input
                                                id="departure_time"
                                                name="departure_time"
                                                type="time"
                                                defaultValue={
                                                    visitor.departure_time || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.departure_time}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="next_destination">
                                                Prochaine destination
                                            </Label>
                                            <Input
                                                id="next_destination"
                                                name="next_destination"
                                                defaultValue={
                                                    visitor.next_destination ||
                                                    ''
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.next_destination
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* INFORMATIONS DE CONTACT */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Informations de contact
                                    </CardTitle>
                                    <CardDescription>
                                        Contact et personne d'urgence
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_country_code">
                                                Indicatif téléphonique
                                            </Label>
                                            <Input
                                                id="phone_country_code"
                                                name="phone_country_code"
                                                defaultValue={
                                                    visitor.phone_country_code ||
                                                    '+225'
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.phone_country_code
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">
                                                Téléphone
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                name="phone_number"
                                                defaultValue={
                                                    visitor.phone_number || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.phone_number}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={
                                                    visitor.email || ''
                                                }
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <p className="font-medium">
                                            Contact d'urgence
                                        </p>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_contact_name">
                                                    Nom
                                                </Label>
                                                <Input
                                                    id="emergency_contact_name"
                                                    name="emergency_contact_name"
                                                    defaultValue={
                                                        visitor.emergency_contact_name ||
                                                        ''
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.emergency_contact_name
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="emergency_contact_country_code">
                                                    Indicatif
                                                </Label>
                                                <Input
                                                    id="emergency_contact_country_code"
                                                    name="emergency_contact_country_code"
                                                    defaultValue={
                                                        visitor.emergency_contact_country_code ||
                                                        '+225'
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.emergency_contact_country_code
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="emergency_contact_phone">
                                                    Téléphone
                                                </Label>
                                                <Input
                                                    id="emergency_contact_phone"
                                                    name="emergency_contact_phone"
                                                    defaultValue={
                                                        visitor.emergency_contact_phone ||
                                                        ''
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.emergency_contact_phone
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="selfie">
                                                Photo selfie
                                            </Label>
                                            {visitor.selfie_path && (
                                                <div className="mb-2">
                                                    <img
                                                        src={`/storage/${visitor.selfie_path}`}
                                                        alt="Selfie actuel"
                                                        className="h-32 w-32 rounded-full border-4 border-primary object-cover"
                                                    />
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Photo actuelle -
                                                        Téléchargez une nouvelle
                                                        photo pour la remplacer
                                                    </p>
                                                </div>
                                            )}
                                            <Input
                                                id="selfie"
                                                name="selfie"
                                                type="file"
                                                accept="image/*"
                                            />
                                            <InputError
                                                message={errors.selfie}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="signature">
                                                Signature
                                            </Label>
                                            {visitor.signature_path && (
                                                <div className="mb-2">
                                                    <img
                                                        src={`/storage/${visitor.signature_path}`}
                                                        alt="Signature actuelle"
                                                        className="h-32 rounded border bg-white object-contain p-2"
                                                    />
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Signature actuelle -
                                                        Téléchargez une nouvelle
                                                        signature pour la
                                                        remplacer
                                                    </p>
                                                </div>
                                            )}
                                            <Input
                                                id="signature"
                                                name="signature"
                                                type="file"
                                                accept="image/*"
                                            />
                                            <InputError
                                                message={errors.signature}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ACTIONS */}
                            <div className="flex justify-between gap-2">
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Enregistrement...'
                                        : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
