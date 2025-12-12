import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    {
        title: 'Visiteurs',
        href: index().url,
    },
    {
        title: 'Nouveau visiteur',
        href: VisitorController.create().url,
    },
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

        console.log('Submitting data:', finalData);

        const formDataToSend = new FormData();
        Object.keys(finalData).forEach((key) => {
            if (finalData[key] !== null && finalData[key] !== undefined) {
                if (finalData[key] instanceof File) {
                    formDataToSend.append(key, finalData[key]);
                    console.log(`Added file: ${key}`, finalData[key]);
                } else {
                    formDataToSend.append(key, finalData[key].toString());
                }
            }
        });

        console.log('FormData ready, submitting to:', VisitorController.store().url);

        router.post(VisitorController.store().url, formDataToSend, {
            onSuccess: () => {
                console.log('Success! Redirecting...');
                router.visit(index().url);
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
        });
    };

    const handleConfirmAndSubmit = () => {
        handleSubmit(formData);
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
                return <StepFour onPrev={handlePrevStep} onConfirm={handleConfirmAndSubmit} formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau visiteur" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Nouveau visiteur</h1>
                        <p className="text-muted-foreground">Enregistrement d'un nouveau visiteur</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Étape {currentStep} sur {totalSteps}</CardTitle>
                        <CardDescription>
                            {currentStep === 1 && 'Scan du document et informations personnelles'}
                            {currentStep === 2 && 'Informations du voyage'}
                            {currentStep === 3 && 'Contact, selfie et signature'}
                            {currentStep === 4 && 'Récapitulatif et confirmation'}
                        </CardDescription>
                        <Progress value={progress} className="mt-4" />
                    </CardHeader>
                    <CardContent>{renderStep()}</CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
 