import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/ConfigController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, Settings } from 'lucide-react';

interface Place {
    id: string;
    name: string;
}

interface Config {
    id: string;
    place?: Place;
    content: Record<string, any>;
    created_at: string;
}

interface Props {
    configs: Config[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Configurations', href: index().url }];

export default function Index({ configs }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
            router.delete(destroy(id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configurations" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Configurations</h1>
                        <p className="text-muted-foreground">Gérez les configurations des lieux</p>
                    </div>
                    <Link href={create().url}>
                        <Button><PlusCircle className="mr-2 h-4 w-4" />Nouvelle configuration</Button>
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {configs.map((config) => (
                        <Card key={config.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    {config.place?.name || 'Sans lieu'}
                                </CardTitle>
                                <CardDescription>
                                    Créé le {new Date(config.created_at).toLocaleDateString('fr-FR')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm text-muted-foreground">
                                    {Object.keys(config.content).length} paramètre(s)
                                </div>
                                <div className="flex gap-2">
                                    <Link href={show(config.id).url}>
                                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Voir</Button>
                                    </Link>
                                    <Link href={edit(config.id).url}>
                                        <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(config.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {configs.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground">Aucune configuration trouvée</p>
                            <Link href={create().url} className="mt-4">
                                <Button><PlusCircle className="mr-2 h-4 w-4" />Créer la première configuration</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
