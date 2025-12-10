import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Download, Filter, Search, Calendar, User, Activity, Database } from 'lucide-react';
import { useState } from 'react';

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
    url: string;
    http_method: string;
    tags: string[];
    created_at: string;
}

interface Filters {
    user_id?: string;
    event?: string;
    auditable_type?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
}

interface Props {
    audits: {
        data: Audit[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: Filters;
    users: User[];
    events: string[];
    auditable_types: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Audits', href: '/audits' },
];

const eventColors: Record<string, string> = {
    'created': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'updated': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'deleted': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'auth.login': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'auth.logout': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'auth.register': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

export default function Index({ audits, filters, users, events, auditable_types }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const handleFilter = () => {
        router.get('/audits', localFilters, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams(localFilters as any).toString();
        window.location.href = `/audits/export?${params}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audits" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Journal d'audit</h1>
                        <p className="text-muted-foreground">
                            Consultez l'historique complet des actions effectuées
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="mr-2 h-4 w-4" />
                            Filtres
                        </Button>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Exporter
                        </Button>
                        <Link href="/audits/statistics">
                            <Button variant="outline">
                                <Activity className="mr-2 h-4 w-4" />
                                Statistiques
                            </Button>
                        </Link>
                    </div>
                </div>

                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtres de recherche</CardTitle>
                            <CardDescription>Affinez vos résultats</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <Label htmlFor="search">Recherche</Label>
                                    <Input
                                        id="search"
                                        placeholder="URL, IP, utilisateur..."
                                        value={localFilters.search || ''}
                                        onChange={(e) =>
                                            setLocalFilters({ ...localFilters, search: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="user">Utilisateur</Label>
                                    <Select
                                        value={localFilters.user_id || ''}
                                        onValueChange={(value) =>
                                            setLocalFilters({ ...localFilters, user_id: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tous les utilisateurs" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Tous</SelectItem>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={String(user.id)}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="event">Événement</Label>
                                    <Select
                                        value={localFilters.event || ''}
                                        onValueChange={(value) =>
                                            setLocalFilters({ ...localFilters, event: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tous les événements" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Tous</SelectItem>
                                            {events.map((event) => (
                                                <SelectItem key={event} value={event}>
                                                    {event}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="type">Type de modèle</Label>
                                    <Select
                                        value={localFilters.auditable_type || ''}
                                        onValueChange={(value) =>
                                            setLocalFilters({ ...localFilters, auditable_type: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tous les types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Tous</SelectItem>
                                            {Object.entries(auditable_types).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button onClick={handleFilter}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Appliquer les filtres
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setLocalFilters({});
                                        router.get('/audits');
                                    }}
                                >
                                    Réinitialiser
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {audits.data.map((audit) => (
                                <div
                                    key={audit.id}
                                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={
                                                    eventColors[audit.event] || 'bg-gray-100 text-gray-800'
                                                }
                                            >
                                                {audit.event}
                                            </Badge>
                                            {audit.auditable_type && (
                                                <Badge variant="outline">
                                                    <Database className="mr-1 h-3 w-3" />
                                                    {audit.auditable_type}
                                                </Badge>
                                            )}
                                            {audit.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {audit.user && (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {audit.user.name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(audit.created_at)}
                                            </span>
                                            <span>IP: {audit.ip_address}</span>
                                            <span className="font-mono text-xs">{audit.http_method}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {audit.url}
                                        </div>
                                    </div>
                                    <Link href={`/audits/${audit.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Détails
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {audits.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Aucun audit trouvé</p>
                        </CardContent>
                    </Card>
                )}

                {audits.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {audits.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
