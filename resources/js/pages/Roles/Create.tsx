import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, store } from '@/actions/App/Http/Controllers/RoleController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Rôles', href: index().url },
    { title: 'Créer un rôle' },
];

const permissionCategories = [
    { key: 'user', label: 'Gestion des utilisateurs', color: 'blue' },
    { key: 'organization', label: 'Gestion des organisations', color: 'green' },
    { key: 'place', label: 'Gestion des lieux', color: 'purple' },
    { key: 'visitor', label: 'Gestion des visiteurs', color: 'orange' },
    { key: 'role', label: 'Gestion des rôles', color: 'red' },
    { key: 'permission', label: 'Gestion des permissions', color: 'yellow' },
    { key: 'config', label: 'Gestion des configurations', color: 'cyan' },
];

export default function Create({ permissions }: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handlePermissionToggle = (permissionName: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionName)
                ? prev.filter((p) => p !== permissionName)
                : [...prev, permissionName]
        );
    };

    const handleCategoryToggle = (category: string) => {
        const categoryPermissions = permissions
            .filter((p) => p.name.toLowerCase().includes(category))
            .map((p) => p.name);

        const allSelected = categoryPermissions.every((p) =>
            selectedPermissions.includes(p)
        );

        if (allSelected) {
            setSelectedPermissions((prev) =>
                prev.filter((p) => !categoryPermissions.includes(p))
            );
        } else {
            setSelectedPermissions((prev) => [
                ...new Set([...prev, ...categoryPermissions]),
            ]);
        }
    };

    const filteredPermissions = permissions.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedPermissions = permissionCategories.map((category) => ({
        ...category,
        permissions: filteredPermissions.filter((p) =>
            p.name.toLowerCase().includes(category.key)
        ),
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un rôle" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Créer un nouveau rôle</h1>
                        <p className="text-muted-foreground">
                            Définissez un rôle et ses permissions associées
                        </p>
                    </div>
                </div>

                <Form {...store.form()}>
                    {({ errors, processing }) => (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Informations du rôle
                                    </CardTitle>
                                    <CardDescription>
                                        Nom et description du rôle
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom du rôle <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Ex: Gestionnaire, Superviseur..."
                                            required
                                        />
                                        {errors.name && <InputError message={errors.name} />}
                                        <p className="text-xs text-muted-foreground">
                                            Choisissez un nom descriptif et unique
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-muted p-4 space-y-2">
                                        <h4 className="text-sm font-medium">Permissions sélectionnées</h4>
                                        <p className="text-2xl font-bold">{selectedPermissions.length}</p>
                                        <p className="text-xs text-muted-foreground">
                                            sur {permissions.length} disponibles
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Permissions
                                            </CardTitle>
                                            <CardDescription>
                                                Sélectionnez les permissions pour ce rôle
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            {selectedPermissions.length} sélectionnées
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input
                                        type="search"
                                        placeholder="Rechercher une permission..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-9"
                                    />

                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                        {groupedPermissions.map((category) => {
                                            if (category.permissions.length === 0) return null;

                                            const allSelected = category.permissions.every((p) =>
                                                selectedPermissions.includes(p.name)
                                            );

                                            return (
                                                <div key={category.key} className="space-y-3">
                                                    <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2 border-b">
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                id={`category-${category.key}`}
                                                                checked={allSelected}
                                                                onCheckedChange={() =>
                                                                    handleCategoryToggle(category.key)
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={`category-${category.key}`}
                                                                className="text-sm font-semibold cursor-pointer"
                                                            >
                                                                {category.label}
                                                            </Label>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {
                                                                category.permissions.filter((p) =>
                                                                    selectedPermissions.includes(p.name)
                                                                ).length
                                                            }
                                                            /{category.permissions.length}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid gap-2 sm:grid-cols-2 ml-6">
                                                        {category.permissions.map((permission) => (
                                                            <div
                                                                key={permission.id}
                                                                className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                                                            >
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    name="permissions[]"
                                                                    value={permission.name}
                                                                    checked={selectedPermissions.includes(
                                                                        permission.name
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        handlePermissionToggle(permission.name)
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`permission-${permission.id}`}
                                                                    className="text-sm font-normal cursor-pointer flex-1"
                                                                >
                                                                    {permission.name}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {errors.permissions && (
                                        <InputError message={errors.permissions} />
                                    )}
                                </CardContent>
                            </Card>

                            <div className="lg:col-span-3 flex gap-2 border-t pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Création en cours...' : 'Créer le rôle'}
                                </Button>
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
