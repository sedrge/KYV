import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/actions/App/Http/Controllers/TypePlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin } from 'lucide-react';

interface Place {
    id: string;
    name: string;
    city?: string;
}

interface TypePlace {
    id: string;
    name: string;
    places?: Place[];
    created_at: string;
    updated_at: string;
}

interface Props {
    typePlace: TypePlace;
}

export default function Show({ typePlace }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Types de lieux',
            href: index().url,
        },
        {
            title: typePlace.name,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={typePlace.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{typePlace.name}</h1>
                            <p className="text-muted-foreground">Détails du type de lieu</p>
                        </div>
                    </div>
                    <Link href={edit(typePlace.id).url}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Nom</p>
                                <p className="font-medium">{typePlace.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Créé le</p>
                                <p className="font-medium">
                                    {new Date(typePlace.created_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Modifié le</p>
                                <p className="font-medium">
                                    {new Date(typePlace.updated_at).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lieux associés</CardTitle>
                            <CardDescription>
                                {typePlace.places?.length || 0} lieu{typePlace.places?.length !== 1 ? 'x' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {typePlace.places && typePlace.places.length > 0 ? (
                                <div className="space-y-2">
                                    {typePlace.places.map((place) => (
                                        <div
                                            key={place.id}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{place.name}</p>
                                                    {place.city && (
                                                        <p className="text-sm text-muted-foreground">{place.city}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Aucun lieu associé</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
