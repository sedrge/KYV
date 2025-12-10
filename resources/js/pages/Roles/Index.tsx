import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, edit, destroy } from '@/actions/App/Http/Controllers/RoleController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Pencil, Trash2, Shield, Users, Lock } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    permissions_count: number;
    users_count: number;
    permissions: string[];
    created_at: string;
}

interface Props {
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Rôles', href: index().url }];

export default function Index({ roles }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le rôle "${name}" ?`)) {
            router.delete(destroy(id).url);
        }
    };

    const getRoleBadgeVariant = (roleName: string) => {
        switch (roleName) {
            case 'Super Admin':
                return 'destructive';
            case 'Admin':
                return 'default';
            case 'Autorités':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rôles" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des Rôles</h1>
                        <p className="text-muted-foreground">
                            Gérez les rôles et leurs permissions
                        </p>
                    </div>
                    <Link href={create().url}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau rôle
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {role.name}
                                            </CardTitle>
                                            <CardDescription>
                                                Créé le{' '}
                                                {new Date(role.created_at).toLocaleDateString('fr-FR')}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={getRoleBadgeVariant(role.name)}>
                                        {role.name}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{role.permissions_count}</span>
                                        <span className="text-muted-foreground">
                                            {role.permissions_count > 1 ? 'permissions' : 'permission'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{role.users_count}</span>
                                        <span className="text-muted-foreground">
                                            {role.users_count > 1 ? 'utilisateurs' : 'utilisateur'}
                                        </span>
                                    </div>
                                </div>

                                {role.permissions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Permissions principales :
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.slice(0, 3).map((permission) => (
                                                <Badge key={permission} variant="secondary" className="text-xs">
                                                    {permission}
                                                </Badge>
                                            ))}
                                            {role.permissions.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{role.permissions.length - 3} autres
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Link href={edit(role.id).url} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(role.id, role.name)}
                                        disabled={role.users_count > 0}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {role.users_count > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        * Ce rôle ne peut pas être supprimé car il est assigné à des
                                        utilisateurs
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {roles.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-12">
                            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">Aucun rôle trouvé</p>
                            <p className="text-muted-foreground mb-4">
                                Commencez par créer votre premier rôle
                            </p>
                            <Link href={create().url}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer le premier rôle
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
