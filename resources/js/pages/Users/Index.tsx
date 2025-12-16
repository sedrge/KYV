import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/UserController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, MapPin, Mail, Shield } from 'lucide-react';

interface Place { id: string; name: string; }
interface User { id: string; name: string; email: string; place?: Place; email_verified_at?: string; roles: string[]; created_at: string; }
interface Props { users: User[]; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Utilisateurs', href: index().url }];

export default function Index({ users }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            router.delete(destroy(id).url);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Utilisateurs" />
            <div className="flex h-full flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Utilisateurs</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Gérez les utilisateurs de votre application</p>
                    </div>
                    <Link href={create().url} className="w-full sm:w-auto"><Button className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" />Nouvel utilisateur</Button></Link>
                </div>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardHeader>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base sm:text-lg truncate">{user.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 text-xs sm:text-sm truncate">
                                            <Mail className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </CardDescription>
                                    </div>
                                    {user.email_verified_at && <Badge variant="default" className="self-start sm:self-auto">Vérifié</Badge>}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {user.place && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                                        <MapPin className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                                        <span className="truncate">{user.place.name}</span>
                                    </div>
                                )}
                                {user.roles && user.roles.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Shield className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <Badge key={role} variant="secondary" className="text-xs">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <Link href={show(user.id).url} className="flex-1 sm:flex-none"><Button variant="outline" size="sm" className="w-full sm:w-auto"><Eye className="mr-2 h-4 w-4" /><span className="hidden sm:inline">Voir</span><span className="sm:hidden">Détails</span></Button></Link>
                                    <Link href={edit(user.id).url} className="flex-1 sm:flex-none"><Button variant="outline" size="sm" className="w-full sm:w-auto"><Pencil className="mr-2 h-4 w-4" />Modifier</Button></Link>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)} className="w-full sm:w-auto"><Trash2 className="h-4 w-4" /><span className="sr-only">Supprimer</span></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {users.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                            <Link href={create().url} className="mt-4"><Button><PlusCircle className="mr-2 h-4 w-4" />Créer le premier utilisateur</Button></Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
