import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/TypePlaceController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface TypePlace {
    id: string;
    name: string;
}

interface Props {
    typePlace: TypePlace;
}

export default function Edit({ typePlace }: Props) {
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
            <Head title={`Modifier ${typePlace.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifier {typePlace.name}</h1>
                        <p className="text-muted-foreground">Modifier les informations du type de lieu</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du type</CardTitle>
                        <CardDescription>Modifiez les informations du type de lieu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...update.form(typePlace.id)}>
                            {({ errors, processing }) => (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={typePlace.name}
                                            placeholder="Ex: Restaurant, Hôtel, Musée..."
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Enregistrement...' : 'Enregistrer'}
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
