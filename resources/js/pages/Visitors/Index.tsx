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

            <div className="flex h-full flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Visiteurs</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Gérer les visiteurs enregistrés</p>
                    </div>
                    <Link href={create().url} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="sm:inline">Nouveau visiteur</span>
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
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[150px]">Nom complet</TableHead>
                                            <TableHead className="hidden sm:table-cell">Type de document</TableHead>
                                            <TableHead className="hidden md:table-cell">Numéro de document</TableHead>
                                            <TableHead className="hidden lg:table-cell">Nationalité</TableHead>
                                            <TableHead className="hidden xl:table-cell">Date d'arrivée</TableHead>
                                            <TableHead className="hidden xl:table-cell">Date de départ</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                <TableBody>
                                    {visitors.map((visitor) => (
                                        <TableRow key={visitor.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{visitor.first_name} {visitor.last_name}</span>
                                                    <span className="text-xs text-muted-foreground sm:hidden">
                                                        {visitor.document_type} - {visitor.document_number}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{visitor.document_type}</TableCell>
                                            <TableCell className="hidden md:table-cell">{visitor.document_number}</TableCell>
                                            <TableCell className="hidden lg:table-cell">{visitor.nationality || '-'}</TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {visitor.arrival_date
                                                    ? new Date(visitor.arrival_date).toLocaleDateString('fr-FR')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {visitor.departure_date
                                                    ? new Date(visitor.departure_date).toLocaleDateString('fr-FR')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={show(visitor.id).url}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">Voir</span>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
 