import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { index, create, show, edit, destroy } from '@/actions/App/Http/Controllers/UserController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Eye, Pencil, Trash2, MapPin, Mail } from 'lucide-react';

interface Place { id: string; name: string; }
interface User { id: string; name: string; email: string; place?: Place; email_verified_at?: string; created_at: string; }
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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Utilisateurs</h1>
                        <p className="text-muted-foreground">Gérez les utilisateurs de votre application</p>
                    </div>
                    <Link href={create().url}><Button><PlusCircle className="mr-2 h-4 w-4" />Nouvel utilisateur</Button></Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle>{user.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </CardDescription>
                                    </div>
                                    {user.email_verified_at && <Badge variant="default">Vérifié</Badge>}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {user.place && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {user.place.name}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Link href={show(user.id).url}><Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Voir</Button></Link>
                                    <Link href={edit(user.id).url}><Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Modifier</Button></Link>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}><Trash2 className="h-4 w-4" /></Button>
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
