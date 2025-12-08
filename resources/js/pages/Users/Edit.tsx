import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/UserController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Place { id: string; name: string; }
interface User { id: string; name: string; email: string; place_id?: string; }
interface Props { user: User; places: Place[]; }

export default function Edit({ user, places }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Utilisateurs', href: index().url },
        { title: user.name },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifier {user.name}</h1>
                        <p className="text-muted-foreground">Modifier les informations de l'utilisateur</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'utilisateur</CardTitle>
                        <CardDescription>Modifiez les informations de l'utilisateur</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...update.form(user.id)}>
                            {({ errors, processing }) => (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom complet *</Label>
                                        <Input id="name" name="name" defaultValue={user.name} required />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" name="email" type="email" defaultValue={user.email} required />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
                                        <Input id="password" name="password" type="password" />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirmation du mot de passe</Label>
                                        <Input id="password_confirmation" name="password_confirmation" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="place_id">Lieu (optionnel)</Label>
                                        <Select name="place_id" defaultValue={user.place_id}>
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
                                        <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : 'Enregistrer'}</Button>
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
