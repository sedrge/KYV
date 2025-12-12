import { edit, index } from '@/actions/App/Http/Controllers/VisitorController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Edit } from 'lucide-react';

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
    created_at: string;
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

export default function Show({ visitor }: Props) {
    const handleExportJSON = () => {
        const dataToExport = {
            ...visitor,
            exported_at: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `visiteur_${visitor.first_name}_${visitor.last_name}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(visitor)}>
            <Head title={`${visitor.first_name} ${visitor.last_name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {visitor.first_name} {visitor.last_name}
                            </h1>
                            <p className="text-muted-foreground">
                                Détails du visiteur
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportJSON}>
                            <Download className="mr-2 h-4 w-4" />
                            Exporter JSON
                        </Button>
                        <Link href={edit(visitor.id).url}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-semibold">Prénom(s):</div>
                                <div>{visitor.first_name}</div>

                                <div className="font-semibold">
                                    Nom de famille:
                                </div>
                                <div>{visitor.last_name}</div>

                                <div className="font-semibold">
                                    Date de naissance:
                                </div>
                                <div>
                                    {visitor.date_of_birth
                                        ? new Date(
                                              visitor.date_of_birth,
                                          ).toLocaleDateString('fr-FR')
                                        : '-'}
                                </div>

                                <div className="font-semibold">
                                    Lieu de naissance:
                                </div>
                                <div>{visitor.place_of_birth || '-'}</div>

                                <div className="font-semibold">
                                    Nom du père:
                                </div>
                                <div>{visitor.father_name || '-'}</div>

                                <div className="font-semibold">
                                    Nom de la mère:
                                </div>
                                <div>{visitor.mother_name || '-'}</div>

                                <div className="font-semibold">Profession:</div>
                                <div>{visitor.profession || '-'}</div>

                                <div className="font-semibold">Adresse:</div>
                                <div>{visitor.home_address || '-'}</div>

                                <div className="font-semibold">
                                    Nombre d'enfants:
                                </div>
                                <div>{visitor.number_of_children || 0}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Document d'identité</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-semibold">
                                    Type de document:
                                </div>
                                <div>{visitor.document_type}</div>

                                <div className="font-semibold">Numéro:</div>
                                <div>{visitor.document_number}</div>

                                <div className="font-semibold">
                                    Nationalité:
                                </div>
                                <div>{visitor.nationality || '-'}</div>
                            </div>

                            {visitor.document_scan_path && (
                                <div className="mt-4">
                                    <div className="mb-2 font-semibold">
                                        Scan du document:
                                    </div>
                                    <img
                                        src={`/storage/${visitor.document_scan_path}`}
                                        alt="Document scan"
                                        className="max-w-full rounded border"
                                    />
                                </div>
                            )}

                            {visitor.selfie_path && (
                                <div className="mt-4">
                                    <div className="mb-2 font-semibold">
                                        Photo:
                                    </div>
                                    <img
                                        src={`/storage/${visitor.selfie_path}`}
                                        alt="Selfie"
                                        className="max-w-xs rounded border"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de voyage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-semibold">
                                    Type de voyage:
                                </div>
                                <div>{visitor.travel_type || '-'}</div>

                                <div className="font-semibold">
                                    Date d'arrivée:
                                </div>
                                <div>
                                    {visitor.arrival_date
                                        ? new Date(
                                              visitor.arrival_date,
                                          ).toLocaleDateString('fr-FR')
                                        : '-'}
                                </div>

                                <div className="font-semibold">
                                    Heure d'arrivée:
                                </div>
                                <div>{visitor.arrival_time || '-'}</div>

                                <div className="font-semibold">
                                    Date de départ:
                                </div>
                                <div>
                                    {visitor.departure_date
                                        ? new Date(
                                              visitor.departure_date,
                                          ).toLocaleDateString('fr-FR')
                                        : '-'}
                                </div>

                                <div className="font-semibold">
                                    Heure de départ:
                                </div>
                                <div>{visitor.departure_time || '-'}</div>

                                <div className="font-semibold">
                                    Motif du voyage:
                                </div>
                                <div>{visitor.travel_reason || '-'}</div>

                                <div className="font-semibold">
                                    Prochaine destination:
                                </div>
                                <div>{visitor.next_destination || '-'}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-semibold">Téléphone:</div>
                                <div>
                                    {visitor.phone_number
                                        ? `${visitor.phone_country_code} ${visitor.phone_number}`
                                        : '-'}
                                </div>

                                <div className="font-semibold">Email:</div>
                                <div>{visitor.email || '-'}</div>

                                <div className="font-semibold">
                                    Contact d'urgence:
                                </div>
                                <div>
                                    {visitor.emergency_contact_name || '-'}
                                </div>

                                <div className="font-semibold">
                                    Tél. d'urgence:
                                </div>
                                <div>
                                    {visitor.emergency_contact_phone
                                        ? `${visitor.emergency_contact_country_code} ${visitor.emergency_contact_phone}`
                                        : '-'}
                                </div>
                            </div>

                            {visitor.signature_path && (
                                <div className="mt-4">
                                    <div className="mb-2 font-semibold">
                                        Signature:
                                    </div>
                                    <img
                                        src={`/storage/${visitor.signature_path}`}
                                        alt="Signature"
                                        className="max-w-xs rounded border bg-white"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
