import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { index, create, edit, destroy } from '@/actions/App/Http/Controllers/PermissionController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, Lock, Search } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    roles_count: number;
    users_count: number;
    created_at: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permissions', href: index().url }];

export default function Index({ permissions }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la permission "${name}" ?`)) {
            router.delete(destroy(id).url);
        }
    };

    const filteredPermissions = permissions.filter((permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group permissions by category
    const groupedPermissions = filteredPermissions.reduce(
        (acc, permission) => {
            const category = permission.name.split(' ')[1] || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>
    );

    const getCategoryLabel = (category: string): string => {
        const labels: Record<string, string> = {
            users: 'Utilisateurs',
            organizations: 'Organisations',
            places: 'Lieux',
            visitors: 'Visiteurs',
            roles: 'Rôles',
            permissions: 'Permissions',
            configs: 'Configurations',
            other: 'Autres',
        };
        return labels[category] || category;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des Permissions</h1>
                        <p className="text-muted-foreground">
                            Gérez les permissions disponibles dans l'application
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouvelle permission
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Liste des permissions</CardTitle>
                                <CardDescription>
                                    {permissions.length} permission{permissions.length > 1 ? 's' : ''} au
                                    total
                                </CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(groupedPermissions).length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <Lock className="mb-4 h-12 w-12 text-muted-foreground" />
                                <p className="text-lg font-medium">Aucune permission trouvée</p>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm
                                        ? 'Essayez avec d\'autres mots-clés'
                                        : 'Commencez par créer votre première permission'}
                                </p>
                                {!searchTerm && (
                                    <Link href={create().url}>
                                        <Button>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Créer la première permission
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <div key={category} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-px flex-1 bg-border" />
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                                {getCategoryLabel(category)}
                                            </h3>
                                            <div className="h-px flex-1 bg-border" />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                            {perms.map((permission) => (
                                                <Card
                                                    key={permission.id}
                                                    className="hover:shadow-md transition-shadow"
                                                >
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="rounded-lg bg-primary/10 p-1.5">
                                                                    <Lock className="h-3.5 w-3.5 text-primary" />
                                                                </div>
                                                                <CardTitle className="text-sm">
                                                                    {permission.name}
                                                                </CardTitle>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {permission.roles_count} rôle
                                                                {permission.roles_count > 1 ? 's' : ''}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {permission.users_count} utilisateur
                                                                {permission.users_count > 1 ? 's' : ''}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <Link href={edit(permission.id).url} className="flex-1">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full"
                                                                >
                                                                    <Pencil className="mr-2 h-3 w-3" />
                                                                    Modifier
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        permission.id,
                                                                        permission.name
                                                                    )
                                                                }
                                                                disabled={
                                                                    permission.roles_count > 0 ||
                                                                    permission.users_count > 0
                                                                }
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        {(permission.roles_count > 0 ||
                                                            permission.users_count > 0) && (
                                                            <p className="text-xs text-muted-foreground">
                                                                * Permission utilisée, suppression impossible
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
