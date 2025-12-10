import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    User,
    Globe,
    Monitor,
    Database,
    Tag,
    Activity,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Audit {
    id: number;
    event: string;
    auditable_type: string | null;
    auditable_id: number | null;
    user: User | null;
    ip_address: string;
    user_agent: string;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    metadata: Record<string, any> | null;
    url: string;
    http_method: string;
    tags: string[];
    changes: Record<string, { old: any; new: any }>;
    created_at: string;
}

interface Props {
    audit: Audit;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Audits', href: '/audits' },
    { title: 'Détails', href: '#' },
];

const eventColors: Record<string, string> = {
    'created': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'updated': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'deleted': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'auth.login': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'auth.logout': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'auth.register': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

export default function Show({ audit }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) {
            return 'N/A';
        }
        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Audit #${audit.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/audits">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Détails de l'audit #{audit.id}</h1>
                            <p className="text-muted-foreground">
                                {formatDate(audit.created_at)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Informations générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Événement</p>
                                <Badge className={eventColors[audit.event] || 'bg-gray-100 text-gray-800'}>
                                    {audit.event}
                                </Badge>
                            </div>

                            {audit.auditable_type && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Type de modèle</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Database className="h-4 w-4" />
                                        <span className="font-mono text-sm">{audit.auditable_type}</span>
                                        {audit.auditable_id && (
                                            <Badge variant="outline">ID: {audit.auditable_id}</Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Méthode HTTP</p>
                                <Badge variant="outline" className="mt-1">
                                    {audit.http_method}
                                </Badge>
                            </div>

                            {audit.tags.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {audit.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                <Tag className="mr-1 h-3 w-3" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Utilisateur et contexte
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {audit.user ? (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
                                    <div className="mt-1">
                                        <p className="font-medium">{audit.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{audit.user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
                                    <p className="text-sm">Non authentifié</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Adresse IP</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Globe className="h-4 w-4" />
                                    <span className="font-mono text-sm">{audit.ip_address}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User Agent</p>
                                <div className="flex items-start gap-2 mt-1">
                                    <Monitor className="h-4 w-4 mt-0.5" />
                                    <span className="text-sm break-all">{audit.user_agent}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">URL</p>
                                <div className="flex items-start gap-2 mt-1">
                                    <Globe className="h-4 w-4 mt-0.5" />
                                    <span className="text-sm break-all">{audit.url}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {Object.keys(audit.changes).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Modifications</CardTitle>
                            <CardDescription>
                                Détails des changements effectués
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(audit.changes).map(([field, change]) => (
                                    <div key={field} className="border-l-2 border-blue-500 pl-4">
                                        <p className="font-medium text-sm">{field}</p>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Ancienne valeur</p>
                                                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm">
                                                    <pre className="whitespace-pre-wrap break-words">
                                                        {formatValue(change.old)}
                                                    </pre>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Nouvelle valeur</p>
                                                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm">
                                                    <pre className="whitespace-pre-wrap break-words">
                                                        {formatValue(change.new)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {audit.metadata && Object.keys(audit.metadata).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Métadonnées</CardTitle>
                            <CardDescription>Informations supplémentaires</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                                {JSON.stringify(audit.metadata, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
