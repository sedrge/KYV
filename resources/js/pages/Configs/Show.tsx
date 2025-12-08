import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/actions/App/Http/Controllers/ConfigController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Settings } from 'lucide-react';

interface Place { id: string; name: string; }
interface Config { id: string; place?: Place; content: Record<string, any>; created_at: string; updated_at: string; }
interface Props { config: Config; }

export default function Show({ config }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Configurations', href: index().url },
        { title: config.place?.name || 'Configuration' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Configuration ${config.place?.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Settings className="h-8 w-8" />
                                {config.place?.name || 'Configuration'}
                            </h1>
                            <p className="text-muted-foreground">Détails de la configuration</p>
                        </div>
                    </div>
                    <Link href={edit(config.id).url}><Button><Pencil className="mr-2 h-4 w-4" />Modifier</Button></Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Lieu</p>
                                <p className="font-medium">{config.place?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Créé le</p>
                                <p className="font-medium">{new Date(config.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Modifié le</p>
                                <p className="font-medium">{new Date(config.updated_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Paramètres de configuration</CardTitle></CardHeader>
                        <CardContent>
                            {Object.keys(config.content).length > 0 ? (
                                <div className="space-y-2">
                                    {Object.entries(config.content).map(([key, value]) => (
                                        <div key={key} className="rounded-lg border p-3">
                                            <p className="text-sm font-medium text-muted-foreground">{key}</p>
                                            <p className="font-medium">{String(value)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Aucun paramètre configuré</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
