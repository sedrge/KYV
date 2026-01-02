import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import VisitorController, { index } from '@/actions/App/Http/Controllers/VisitorController';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Visiteurs', href: index().url },
    { title: 'Nouveau visiteur', href: VisitorController.create().url },
];

export default function Create() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, any>>({
        phone_country_code: '+225',
        emergency_contact_country_code: '+225',
    });

    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const handleNextStep = (data: Record<string, any>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = (data: Record<string, any>) => {
        const finalData = { ...formData, ...data };

        const formDataToSend = new FormData();
        Object.keys(finalData).forEach((key) => {
            if (finalData[key] !== null && finalData[key] !== undefined) {
                formDataToSend.append(
                    key,
                    finalData[key] instanceof File
                        ? finalData[key]
                        : finalData[key].toString()
                );
            }
        });

        router.post(VisitorController.store().url, formDataToSend, {
            onSuccess: () => router.visit(index().url),
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOne onNext={handleNextStep} initialData={formData} />;
            case 2:
                return <StepTwo onNext={handleNextStep} onPrev={handlePrevStep} initialData={formData} />;
            case 3:
                return <StepThree onPrev={handlePrevStep} onNext={handleNextStep} initialData={formData} />;
            case 4:
                return <StepFour onPrev={handlePrevStep} onConfirm={() => handleSubmit(formData)} formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau visiteur" />

            {/* 🌍 BACKGROUND IMMERSIF */}
            <div className="relative min-h-screen overflow-hidden">
                {/* 🎥 VIDEO BACKGROUND */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="fixed inset-0 h-screen w-screen object-cover"
                >
                    <source src="/videos/visitor-bg1.mp4" type="video/mp4" />
                </video>

                {/* 🌈 OVERLAY LÉGER */}
                <div className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />

                {/* 🌟 CONTENU */}
                <div className="relative z-10 flex flex-col items-center px-4 py-10">
                    <div className="w-full max-w-4xl">
                        {/* HEADER */}
                        <div className="mb-6 flex items-center gap-4 text-white">
                            <Link href={index().url}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-white/30 text-white hover:bg-white/10"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>

                            <div>
                                <h1 className="text-3xl font-bold">
                                    Enregistrement du visiteur
                                </h1>
                                <p className="text-sm text-white/80">
                                    Suivez les étapes pour enregistrer un nouveau visiteur
                                </p>
                            </div>
                        </div>

                        {/* CARD PRINCIPALE */}
                        <Card className="bg-background/90 backdrop-blur-xl shadow-2xl">
                            <CardHeader>
                                <CardTitle>
                                    Étape {currentStep} sur {totalSteps}
                                </CardTitle>
                                <CardDescription>
                                    {currentStep === 1 && 'Scan du document et informations personnelles'}
                                    {currentStep === 2 && 'Informations du voyage'}
                                    {currentStep === 3 && 'Contact, selfie et signature'}
                                    {currentStep === 4 && 'Récapitulatif et confirmation'}
                                </CardDescription>
                                <Progress value={progress} className="mt-4" />
                            </CardHeader>

                            <CardContent className="pt-6">
                                {renderStep()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
