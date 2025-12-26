import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/actions/App/Http/Controllers/QrCodeController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface QrCode {
    id: string;
    title: string;
    url: string;
    size: string;
}

interface Props {
    qrCode: QrCode;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'QR Codes',
        href: index().url,
    },
    {
        title: 'Modifier',
    },
];

export default function Edit({ qrCode }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier - ${qrCode.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Modifier le QR Code</h1>
                        <p className="text-muted-foreground">{qrCode.title}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du QR Code</CardTitle>
                        <CardDescription>Modifiez les informations du QR Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...update.form(qrCode.id)} method="patch">
                            {({ errors, processing }) => (
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre *</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            defaultValue={qrCode.title}
                                            required
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="url">URL *</Label>
                                        <Input
                                            id="url"
                                            name="url"
                                            type="url"
                                            defaultValue={qrCode.url}
                                            required
                                        />
                                        <InputError message={errors.url} />
                                        <p className="text-sm text-muted-foreground">
                                            L'URL vers laquelle le QR Code redirigera
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="size">Taille (pixels)</Label>
                                        <Input
                                            id="size"
                                            name="size"
                                            type="number"
                                            min="100"
                                            max="1000"
                                            defaultValue={qrCode.size}
                                        />
                                        <InputError message={errors.size} />
                                        <p className="text-sm text-muted-foreground">
                                            Taille du QR Code en pixels (100-1000)
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
