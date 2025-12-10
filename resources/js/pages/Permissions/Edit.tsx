import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/PermissionController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft, Lock, Info } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permission: Permission;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Permissions', href: index().url },
    { title: 'Modifier une permission' },
];

const permissionExamples = [
    'view users',
    'create users',
    'edit users',
    'delete users',
    'manage organizations',
    'view reports',
    'export data',
];

export default function Edit({ permission }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier la permission "${permission.name}"`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">
                            Modifier la permission "{permission.name}"
                        </h1>
                        <p className="text-muted-foreground">
                            Modifiez le nom de la permission
                        </p>
                    </div>
                </div>

                <Form {...update.form(permission.id)}>
                    {({ errors, processing }) => (
                        <div className="max-w-2xl grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Informations de la permission
                                    </CardTitle>
                                    <CardDescription>
                                        Modifiez le nom de la permission
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nom de la permission <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={permission.name}
                                            placeholder="Ex: view users, create posts..."
                                            required
                                            autoFocus
                                        />
                                        {errors.name && <InputError message={errors.name} />}
                                        <p className="text-xs text-muted-foreground">
                                            Utilisez le format : action + ressource (ex: view users, edit posts)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-muted">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Info className="h-4 w-4" />
                                        Conventions de nommage
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">
                                            Exemples de permissions :
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {permissionExamples.map((example) => (
                                                <code
                                                    key={example}
                                                    className="px-2 py-1 bg-muted rounded text-xs font-mono"
                                                >
                                                    {example}
                                                </code>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>
                                                Utilisez des verbes d'action : view, create, edit, delete, manage
                                            </span>
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>
                                                Utilisez le pluriel pour les ressources : users, posts, comments
                                            </span>
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>
                                                Gardez les noms courts et descriptifs
                                            </span>
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>
                                                Utilisez des minuscules avec espaces comme séparateurs
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-2 border-t pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Mise à jour en cours...'
                                        : 'Enregistrer les modifications'}
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
