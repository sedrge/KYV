import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Activity,
    Users,
    Database,
    TrendingUp,
    BarChart3,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Statistics {
    total_audits: number;
    audits_by_event: Record<string, number>;
    audits_by_user: Array<{
        user: User | null;
        count: number;
    }>;
    audits_by_model: Record<string, number>;
}

interface Props {
    statistics: Statistics;
    filters: {
        start_date?: string;
        end_date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Audits', href: '/audits' },
    { title: 'Statistiques', href: '#' },
];

const eventColors: Record<string, string> = {
    'created': 'bg-green-100 text-green-800',
    'updated': 'bg-blue-100 text-blue-800',
    'deleted': 'bg-red-100 text-red-800',
    'auth.login': 'bg-purple-100 text-purple-800',
    'auth.logout': 'bg-gray-100 text-gray-800',
    'auth.register': 'bg-indigo-100 text-indigo-800',
};

export default function Statistics({ statistics, filters }: Props) {
    const maxEventCount = Math.max(...Object.values(statistics.audits_by_event));
    const maxUserCount = Math.max(...statistics.audits_by_user.map((u) => u.count));
    const maxModelCount = Math.max(...Object.values(statistics.audits_by_model));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Statistiques d'audit" />
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
                            <h1 className="text-3xl font-bold">Statistiques d'audit</h1>
                            <p className="text-muted-foreground">
                                Vue d'ensemble des activités système
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total d'audits</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_audits}</div>
                            <p className="text-xs text-muted-foreground">
                                Événements enregistrés
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Événements</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.keys(statistics.audits_by_event).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Types différents
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.audits_by_user.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ont effectué des actions
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Modèles audités</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.keys(statistics.audits_by_model).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Types de modèles
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Événements par type
                            </CardTitle>
                            <CardDescription>
                                Répartition des actions effectuées
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(statistics.audits_by_event)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([event, count]) => {
                                        const percentage = (count / maxEventCount) * 100;
                                        return (
                                            <div key={event}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <Badge
                                                        className={
                                                            eventColors[event] ||
                                                            'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {event}
                                                    </Badge>
                                                    <span className="text-sm font-medium">{count}</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Top utilisateurs
                            </CardTitle>
                            <CardDescription>
                                Utilisateurs les plus actifs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statistics.audits_by_user.slice(0, 10).map((userAudit, index) => {
                                    const percentage = (userAudit.count / maxUserCount) * 100;
                                    return (
                                        <div key={index}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        {userAudit.user ? (
                                                            <>
                                                                <p className="text-sm font-medium">
                                                                    {userAudit.user.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {userAudit.user.email}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm">Non authentifié</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {userAudit.count}
                                                </span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Activité par modèle
                        </CardTitle>
                        <CardDescription>
                            Types de modèles les plus modifiés
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(statistics.audits_by_model)
                                .sort(([, a], [, b]) => b - a)
                                .map(([model, count]) => {
                                    const percentage = (count / maxModelCount) * 100;
                                    const modelName = model.split('\\').pop() || model;
                                    return (
                                        <div key={model}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Database className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{modelName}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {model}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium">{count}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
