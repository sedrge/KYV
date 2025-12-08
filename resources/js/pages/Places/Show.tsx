import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/actions/App/Http/Controllers/PlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, MapPin, Phone, Mail, Globe, Star } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
}

interface Place {
    id: string;
    name: string;
    type_place?: TypePlace;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    website?: string;
    rating?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    place: Place;
}

export default function Show({ place }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Lieux', href: index().url },
        { title: place.name },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={place.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}>
                            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{place.name}</h1>
                                <Badge variant={place.is_active ? 'default' : 'secondary'}>
                                    {place.is_active ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{place.type_place?.name}</p>
                        </div>
                    </div>
                    <Link href={edit(place.id).url}>
                        <Button><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Nom</p>
                                <p className="font-medium">{place.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium">{place.type_place?.name || 'N/A'}</p>
                            </div>
                            {place.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="font-medium">{place.description}</p>
                                </div>
                            )}
                            {place.rating && (
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <p className="font-medium">{place.rating} / 5</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {(place.address || place.city) && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        {place.address && <p>{place.address}</p>}
                                        {place.city && <p>{place.city}</p>}
                                    </div>
                                </div>
                            )}
                            {place.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p>{place.phone}</p>
                                </div>
                            )}
                            {place.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p>{place.email}</p>
                                </div>
                            )}
                            {place.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {place.website}
                                    </a>
                                </div>
                            )}
                            {(place.latitude && place.longitude) && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Coordonnées GPS</p>
                                    <p className="font-medium">{place.latitude}, {place.longitude}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
