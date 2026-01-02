import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';
import { Building2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { type Place } from '@/types';
import VisitorController from '@/actions/App/Http/Controllers/VisitorController';

interface Props {
    place: Place;
}

export default function PlaceVisitorForm({ place }: Props) {
    const handleStartRegistration = () => {
        router.visit(VisitorController.create().url, {
            data: {
                place_id: place.id,
            },
        });
    };

    return (
        <>
            <Head title={`Formulaire visiteur - ${place.name}`} />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="fixed inset-0 h-screen w-screen object-cover opacity-30"
                >
                    <source src="/videos/visitor-bg1.mp4" type="video/mp4" />
                </video>

                <div className="fixed inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />

                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
                    <div className="w-full max-w-2xl">
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                                Bienvenue
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Vous êtes sur le point de vous enregistrer en tant que visiteur
                            </p>
                        </div>

                        <Card className="bg-background/95 shadow-2xl backdrop-blur-xl">
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                                        <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl">{place.name}</CardTitle>
                                <CardDescription className="text-base">
                                    {place.type_place?.name}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Informations du lieu
                                    </h3>

                                    {place.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {place.description}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        {place.address && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {place.address}
                                                    {place.city && `, ${place.city}`}
                                                </span>
                                            </div>
                                        )}

                                        {place.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {place.phone}
                                                </span>
                                            </div>
                                        )}

                                        {place.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {place.email}
                                                </span>
                                            </div>
                                        )}

                                        {place.website && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Globe className="h-4 w-4 text-gray-500" />
                                                <a
                                                    href={place.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    {place.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                        <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
                                            Étapes d'enregistrement
                                        </h4>
                                        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                            <li>Scan de votre document d'identité</li>
                                            <li>Informations de voyage</li>
                                            <li>Photo et signature</li>
                                            <li>Confirmation</li>
                                        </ol>
                                    </div>

                                    <Button
                                        onClick={handleStartRegistration}
                                        className="w-full py-6 text-lg"
                                        size="lg"
                                    >
                                        Commencer l'enregistrement
                                    </Button>
                                </div>

                                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    En continuant, vous acceptez de fournir vos informations personnelles
                                    pour votre enregistrement en tant que visiteur.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
