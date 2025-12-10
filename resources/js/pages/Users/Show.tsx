import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, edit } from '@/actions/App/Http/Controllers/UserController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Mail, MapPin, Calendar, CheckCircle, Shield, Lock } from 'lucide-react';

interface Place { id: string; name: string; }
interface User {
    id: string;
    name: string;
    email: string;
    place?: Place;
    roles: string[];
    permissions: string[];
    email_verified_at?: string;
    created_at: string;
}
interface Props { user: User; }

export default function Show({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Utilisateurs', href: index().url },
        { title: user.name },
    ];

    const getInitials = (name: string) => {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index().url}><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    {user.email_verified_at && <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Vérifié</Badge>}
                                </div>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <Link href={edit(user.id).url}><Button><Pencil className="mr-2 h-4 w-4" />Modifier</Button></Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Nom complet</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            {user.place && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lieu</p>
                                        <p className="font-medium">{user.place.name}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Informations système</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé le</p>
                                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                            {user.email_verified_at && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email vérifié le</p>
                                        <p className="font-medium">{new Date(user.email_verified_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Rôles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.roles && user.roles.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map((role) => (
                                        <Badge key={role} variant="default" className="text-sm">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun rôle assigné</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <CardTitle>Permissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.permissions && user.permissions.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {user.permissions.length} permission{user.permissions.length > 1 ? 's' : ''} au total
                                    </p>
                                    <div className="max-h-[200px] overflow-y-auto">
                                        <div className="flex flex-wrap gap-1">
                                            {user.permissions.map((permission) => (
                                                <Badge key={permission} variant="secondary" className="text-xs">
                                                    {permission}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune permission</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
