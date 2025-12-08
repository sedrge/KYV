import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/PlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
}

interface Place {
    id: string;
    name: string;
    type_place_id: string;
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
}

interface Props {
    place: Place;
    typePlaces: TypePlace[];
}

export default function Edit({ place, typePlaces }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Lieux', href: index().url },
        { title: place.name },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${place.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifier {place.name}</h1>
                        <p className="text-muted-foreground">Modifier les informations du lieu</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du lieu</CardTitle>
                        <CardDescription>Modifiez les informations du lieu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...update.form(place.id)}>
                            {({ errors, processing }) => (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom *</Label>
                                        <Input id="name" name="name" defaultValue={place.name} required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type_place_id">Type de lieu *</Label>
                                        <Select name="type_place_id" defaultValue={place.type_place_id} required>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {typePlaces.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.type_place_id} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse</Label>
                                        <Input id="address" name="address" defaultValue={place.address} />
                                        <InputError message={errors.address} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input id="city" name="city" defaultValue={place.city} />
                                        <InputError message={errors.city} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input id="phone" name="phone" type="tel" defaultValue={place.phone} />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" defaultValue={place.email} />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input id="latitude" name="latitude" type="number" step="0.00000001" defaultValue={place.latitude} />
                                        <InputError message={errors.latitude} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input id="longitude" name="longitude" type="number" step="0.00000001" defaultValue={place.longitude} />
                                        <InputError message={errors.longitude} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Site web</Label>
                                        <Input id="website" name="website" type="url" defaultValue={place.website} />
                                        <InputError message={errors.website} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Note (0-5)</Label>
                                        <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={place.rating} />
                                        <InputError message={errors.rating} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            defaultValue={place.description}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="col-span-2 flex items-center space-x-2">
                                        <Checkbox id="is_active" name="is_active" defaultChecked={place.is_active} />
                                        <Label htmlFor="is_active">Actif</Label>
                                    </div>
                                    <div className="col-span-2 flex gap-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                                        </Button>
                                        <Link href={index().url}><Button type="button" variant="outline">Annuler</Button></Link>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
