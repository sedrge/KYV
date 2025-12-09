import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/ConfigController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, Settings, Globe, Shield } from 'lucide-react';

interface Config {
    id: string;
    organization_name?: string;
    organization_short_name?: string;
    default_language?: string;
    enable_visitors: boolean;
    enable_sales: boolean;
    enable_reports: boolean;
    maintenance_mode: boolean;
    created_at: string;
}

interface Props {
    configs: Config[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configurations',
        href: index().url,
    },
];

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
                        <p className="text-muted-foreground">Gérez les configurations de votre application</p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouvelle configuration
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {configs.map((config) => (
                        <Card key={config.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle>
                                            {config.organization_name || config.organization_short_name || 'Configuration sans nom'}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {config.default_language ? `Langue: ${config.default_language}` : 'Pas de langue définie'}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={config.maintenance_mode ? 'destructive' : 'default'}>
                                        {config.maintenance_mode ? 'Maintenance' : 'Actif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {config.enable_visitors && (
                                        <Badge variant="outline" className="text-xs">
                                            <Globe className="mr-1 h-3 w-3" />
                                            Visiteurs
                                        </Badge>
                                    )}
                                    {config.enable_sales && (
                                        <Badge variant="outline" className="text-xs">
                                            <Settings className="mr-1 h-3 w-3" />
                                            Ventes
                                        </Badge>
                                    )}
                                    {config.enable_reports && (
                                        <Badge variant="outline" className="text-xs">
                                            <Shield className="mr-1 h-3 w-3" />
                                            Rapports
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={show(config.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Button>
                                    </Link>
                                    <Link href={edit(config.id).url}>
                                        <Button variant="outline" size="sm">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(config.id)}
                                    >
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
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer la première configuration
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
