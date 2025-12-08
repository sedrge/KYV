import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import PlaceController, { index, store } from '@/actions/App/Http/Controllers/PlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
}

interface Props {
    typePlaces: TypePlace[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lieux',
        href: index().url,
    },
    {
        title: 'Nouveau lieu',
        href: PlaceController.create().url,
    },
];

export default function Create({ typePlaces }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau lieu" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Nouveau lieu</h1>
                        <p className="text-muted-foreground">Créer un nouveau lieu</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du lieu</CardTitle>
                        <CardDescription>Renseignez les informations du nouveau lieu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...store.form()}>
                            {({ errors, processing}) => (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom *</Label>
                                        <Input id="name" name="name" required />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type_place_id">Type de lieu *</Label>
                                        <Select name="type_place_id" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {typePlaces.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.type_place_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse</Label>
                                        <Input id="address" name="address" />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input id="city" name="city" />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input id="phone" name="phone" type="tel" />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input id="latitude" name="latitude" type="number" step="0.00000001" />
                                        <InputError message={errors.latitude} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input id="longitude" name="longitude" type="number" step="0.00000001" />
                                        <InputError message={errors.longitude} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Site web</Label>
                                        <Input id="website" name="website" type="url" />
                                        <InputError message={errors.website} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Note (0-5)</Label>
                                        <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" />
                                        <InputError message={errors.rating} />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="col-span-2 flex items-center space-x-2">
                                        <Checkbox id="is_active" name="is_active" defaultChecked />
                                        <Label htmlFor="is_active">Actif</Label>
                                    </div>

                                    <div className="col-span-2 flex gap-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Création...' : 'Créer'}
                                        </Button>
                                        <Link href={index().url}>
                                            <Button type="button" variant="outline">
                                                Annuler
                                            </Button>
                                        </Link>
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
