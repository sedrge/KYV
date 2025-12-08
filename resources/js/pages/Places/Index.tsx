import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/PlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, MapPin, Users, Star } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
}

interface Place {
    id: string;
    name: string;
    type_place?: TypePlace;
    city?: string;
    address?: string;
    rating?: number;
    is_active: boolean;
    users_count?: number;
}

interface Props {
    places: Place[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lieux',
        href: index().url,
    },
];

export default function Index({ places }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lieux" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Lieux</h1>
                        <p className="text-muted-foreground">Gérez les lieux de votre application</p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau lieu
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {places.map((place) => (
                        <Card key={place.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle>{place.name}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {place.type_place?.name}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={place.is_active ? 'default' : 'secondary'}>
                                        {place.is_active ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {place.city && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {place.city}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {place.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {place.rating}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {place.users_count || 0}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={show(place.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Button>
                                    </Link>
                                    <Link href={edit(place.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(place.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {places.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground">Aucun lieu trouvé</p>
                            <Link href={create().url} className="mt-4">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer le premier lieu
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
