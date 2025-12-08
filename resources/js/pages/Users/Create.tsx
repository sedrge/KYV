import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/actions/App/Http/Controllers/UserController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Place { id: string; name: string; }
interface Props { places: Place[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilisateurs', href: index().url },
    { title: 'Nouvel utilisateur' },
];

export default function Create({ places }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvel utilisateur" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold">Nouvel utilisateur</h1>
                        <p className="text-muted-foreground">Créer un nouvel utilisateur</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'utilisateur</CardTitle>
                        <CardDescription>Renseignez les informations du nouvel utilisateur</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...store.form()}>
                            {({ errors, processing }) => (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom complet *</Label>
                                        <Input id="name" name="name" required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" name="email" type="email" required />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Mot de passe *</Label>
                                        <Input id="password" name="password" type="password" required />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmation du mot de passe *</Label>
                                        <Input id="password_confirmation" name="password_confirmation" type="password" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="place_id">Lieu (optionnel)</Label>
                                        <Select name="place_id">
                                            <SelectTrigger><SelectValue placeholder="Sélectionner un lieu" /></SelectTrigger>
                                            <SelectContent>
                                                {places.map((place) => (
                                                    <SelectItem key={place.id} value={place.id}>{place.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.place_id} />
                                    </div>
                                    <div className="col-span-2 flex gap-2">
                                        <Button type="submit" disabled={processing}>{processing ? 'Création...' : 'Créer'}</Button>
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
