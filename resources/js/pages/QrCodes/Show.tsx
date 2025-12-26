import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/actions/App/Http/Controllers/QrCodeController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Printer, Pencil, ExternalLink, Calendar, User, Download as DownloadIcon, Printer as PrinterIcon } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface QrCode {
    id: string;
    title: string;
    url: string;
    size: string;
    download_count: number;
    print_count: number;
    user?: User;
    created_at: string;
    updated_at: string;
}

interface Props {
    qrCode: QrCode;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'QR Codes',
        href: index().url,
    },
    {
        title: 'Détails',
    },
];

export default function Show({ qrCode }: Props) {
    const handleDownload = () => {
        window.location.href = `/qr-codes/${qrCode.id}/download`;
    };

    const handlePrint = () => {
        window.open(`/qr-codes/${qrCode.id}/print`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`QR Code - ${qrCode.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{qrCode.title}</h1>
                            <p className="text-muted-foreground">Détails du QR Code</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                        </Button>
                        <Button onClick={handlePrint} variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimer
                        </Button>
                        <Link href={edit(qrCode.id).url}>
                            <Button variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code</CardTitle>
                            <CardDescription>Scannez ce code pour accéder au lien</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="rounded-lg border bg-white p-4">
                                <img
                                    src={`/qr-codes/${qrCode.id}/generate`}
                                    alt={qrCode.title}
                                    className="h-auto w-full"
                                    style={{ maxWidth: `${qrCode.size}px` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">URL de destination</p>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={qrCode.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {qrCode.url}
                                        </a>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Taille</p>
                                    <p className="text-sm">{qrCode.size} pixels</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Créé par</p>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">{qrCode.user?.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">
                                            {new Date(qrCode.created_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DownloadIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Téléchargements</span>
                                    </div>
                                    <Badge variant="secondary">{qrCode.download_count}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PrinterIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Impressions</span>
                                    </div>
                                    <Badge variant="secondary">{qrCode.print_count}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
