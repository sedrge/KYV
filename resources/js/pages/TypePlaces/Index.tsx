import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/TypePlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2 } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
    places_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    typePlaces: TypePlace[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Types de lieux',
        href: index().url,
    },
];

export default function Index({ typePlaces }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce type de lieu ?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Types de lieux" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Types de lieux</h1>
                        <p className="text-muted-foreground">Gérez les types de lieux de votre application</p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau type
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {typePlaces.map((typePlace) => (
                        <Card key={typePlace.id}>
                            <CardHeader>
                                <CardTitle>{typePlace.name}</CardTitle>
                                <CardDescription>
                                    {typePlace.places_count} lieu{typePlace.places_count !== 1 ? 'x' : ''}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Link href={show(typePlace.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Button>
                                    </Link>
                                    <Link href={edit(typePlace.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(typePlace.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {typePlaces.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground">Aucun type de lieu trouvé</p>
                            <Link href={create().url} className="mt-4">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer le premier type
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
