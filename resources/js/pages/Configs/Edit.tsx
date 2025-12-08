import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/ConfigController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Place { id: string; name: string; }
interface Config { id: string; place_id: string; content: Record<string, string>; }
interface Props { config: Config; places: Place[]; }

export default function Edit({ config: initialConfig, places }: Props) {
    const [config, setConfig] = useState<Record<string, string>>(initialConfig.content);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    const addConfigItem = () => {
        if (key && value) {
            setConfig({ ...config, [key]: value });
            setKey('');
            setValue('');
        }
    };

    const removeConfigItem = (k: string) => {
        const newConfig = { ...config };
        delete newConfig[k];
        setConfig(newConfig);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Configurations', href: index().url },
        { title: 'Modifier' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifier configuration" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifier configuration</h1>
                        <p className="text-muted-foreground">Modifier la configuration</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de la configuration</CardTitle>
                        <CardDescription>Modifiez les informations de la configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...update.form(initialConfig.id)}>
                            {({ errors, processing }) => (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="place_id">Lieu *</Label>
                                        <Select name="place_id" defaultValue={initialConfig.place_id} required>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {places.map((place) => (
                                                    <SelectItem key={place.id} value={place.id}>{place.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.place_id} />
                                    </div>
                                    <div className="space-y-4">
                                        <Label>Configuration (clé-valeur)</Label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Clé" value={key} onChange={(e) => setKey(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base" />
                                            <input type="text" placeholder="Valeur" value={value} onChange={(e) => setValue(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base" />
                                            <Button type="button" onClick={addConfigItem}>Ajouter</Button>
                                        </div>
                                        {Object.entries(config).map(([k, v]) => (
                                            <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                                                <div><span className="font-medium">{k}:</span> {v}</div>
                                                <Button type="button" variant="destructive" size="sm" onClick={() => removeConfigItem(k)}>Supprimer</Button>
                                            </div>
                                        ))}
                                        <input type="hidden" name="content" value={JSON.stringify(config)} />
                                        <InputError message={errors.content} />
                                    </div>
                                    <div className="flex gap-2">
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
