import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import PlaceVisitorFormController from '@/actions/App/Http/Controllers/PlaceVisitorFormController';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Home } from 'lucide-react';

interface Place {
    id: number;
    name: string;
    typePlace?: {
        name: string;
    };
}

interface Props {
    place: Place;
}

export default function PlaceVisitorSuccess({ place }: Props) {
    return (
        <PublicLayout showHeader={false}>
            <Head title="Enregistrement réussi" />

            <div className="w-full max-w-2xl">
                <Card className="bg-background/90 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="pb-4 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>

                        <CardTitle className="text-2xl sm:text-3xl">
                            Enregistrement réussi !
                        </CardTitle>

                        <CardDescription className="text-base">
                            Votre enregistrement a été effectué avec succès
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="mb-1 text-sm text-muted-foreground">
                                Lieu d'enregistrement
                            </p>
                            <p className="text-lg font-semibold">{place.name}</p>
                            {place.typePlace && (
                                <p className="text-sm text-muted-foreground">
                                    {place.typePlace.name}
                                </p>
                            )}
                        </div>

                        <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                Merci pour votre enregistrement. Vous pouvez maintenant
                                fermer cette page ou enregistrer un nouveau visiteur.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={PlaceVisitorFormController.create(place.id).url}
                                className="flex-1"
                            >
                                <Button variant="outline" className="w-full">
                                    Enregistrer un autre visiteur
                                </Button>
                            </Link>

                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={() => window.close()}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Fermer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
