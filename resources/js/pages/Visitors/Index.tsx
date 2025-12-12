import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import VisitorController, { create, show } from '@/actions/App/Http/Controllers/VisitorController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';

interface Visitor {
    id: number;
    first_name: string;
    last_name: string;
    document_type: string;
    document_number: string;
    nationality: string | null;
    arrival_date: string | null;
    departure_date: string | null;
    created_at: string;
}

interface Props {
    visitors: Visitor[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Visiteurs',
        href: VisitorController.index().url,
    },
];

export default function Index({ visitors }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visiteurs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Visiteurs</h1>
                        <p className="text-muted-foreground">Gérer les visiteurs enregistrés</p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau visiteur
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des visiteurs</CardTitle>
                        <CardDescription>
                            {visitors.length} visiteur{visitors.length > 1 ? 's' : ''} enregistré{visitors.length > 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {visitors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-muted-foreground">Aucun visiteur enregistré</p>
                                <Link href={create().url}>
                                    <Button className="mt-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Enregistrer un visiteur
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom complet</TableHead>
                                        <TableHead>Type de document</TableHead>
                                        <TableHead>Numéro de document</TableHead>
                                        <TableHead>Nationalité</TableHead>
                                        <TableHead>Date d'arrivée</TableHead>
                                        <TableHead>Date de départ</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visitors.map((visitor) => (
                                        <TableRow key={visitor.id}>
                                            <TableCell className="font-medium">
                                                {visitor.first_name} {visitor.last_name}
                                            </TableCell>
                                            <TableCell>{visitor.document_type}</TableCell>
                                            <TableCell>{visitor.document_number}</TableCell>
                                            <TableCell>{visitor.nationality || '-'}</TableCell>
                                            <TableCell>
                                                {visitor.arrival_date
                                                    ? new Date(visitor.arrival_date).toLocaleDateString('fr-FR')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {visitor.departure_date
                                                    ? new Date(visitor.departure_date).toLocaleDateString('fr-FR')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={show(visitor.id).url}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
 