import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/QrCodeController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, Download, Printer, QrCode as QrCodeIcon } from 'lucide-react';

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
}

interface Props {
    qrCodes: QrCode[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'QR Codes',
        href: index().url,
    },
];

export default function Index({ qrCodes }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce QR Code ?')) {
            router.delete(destroy(id).url);
        }
    };

    const handleDownload = (id: string) => {
        window.location.href = `/qr-codes/${id}/download`;
    };

    const handlePrint = (id: string) => {
        window.open(`/qr-codes/${id}/print`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="QR Codes" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">QR Codes</h1>
                        <p className="text-muted-foreground">Gérez vos QR codes générés</p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau QR Code
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {qrCodes.map((qrCode) => (
                        <Card key={qrCode.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle>{qrCode.title}</CardTitle>
                                        <CardDescription className="mt-1 truncate">
                                            {qrCode.url}
                                        </CardDescription>
                                    </div>
                                    <QrCodeIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Taille: {qrCode.size}px</span>
                                    <Badge variant="secondary">{qrCode.user?.name}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Download className="h-4 w-4" />
                                        {qrCode.download_count}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Printer className="h-4 w-4" />
                                        {qrCode.print_count}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href={show(qrCode.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(qrCode.id)}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePrint(qrCode.id)}
                                    >
                                        <Printer className="mr-2 h-4 w-4" />
                                        Imprimer
                                    </Button>
                                    <Link href={edit(qrCode.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(qrCode.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {qrCodes.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <QrCodeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">Aucun QR Code trouvé</p>
                            <Link href={create().url} className="mt-4">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer le premier QR Code
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
