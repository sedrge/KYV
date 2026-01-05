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
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import StepOne from '../Visitors/components/StepOne';
import StepTwo from '../Visitors/components/StepTwo';
import StepThree from '../Visitors/components/StepThree';
import StepFour from '../Visitors/components/StepFour';

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

const steps = [
    { id: 1, label: 'Documents', description: 'Scan & infos' },
    { id: 2, label: 'Voyage', description: 'Trajet & dates' },
    { id: 3, label: 'Contact', description: 'Selfie & signature' },
    { id: 4, label: 'Confirmation', description: 'Validation finale' },
];

function Stepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="mb-8 flex w-full items-center justify-between">
            {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={[
                                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                                    isCompleted
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : isActive
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-muted bg-background text-muted-foreground',
                                ].join(' ')}
                            >
                                {step.id}
                            </div>

                            <span className="mt-2 text-xs font-medium sm:text-sm">
                                {step.label}
                            </span>
                            <span className="hidden text-xs text-muted-foreground sm:block">
                                {step.description}
                            </span>
                        </div>

                        {index !== steps.length - 1 && (
                            <div
                                className={[
                                    'mx-2 h-0.5 flex-1 transition-all',
                                    isCompleted
                                        ? 'bg-green-500'
                                        : 'bg-muted',
                                ].join(' ')}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function PlaceVisitorCreate({ place }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, any>>({
        place_id: place.id,
        phone_country_code: '+226',
        emergency_contact_country_code: '+226',
    });

    const totalSteps = 4;

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

        router.post(PlaceVisitorFormController.store(place.id).url, formDataToSend);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOne onNext={handleNextStep} initialData={formData} />;
            case 2:
                return (
                    <StepTwo
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                        initialData={formData}
                    />
                );
            case 3:
                return (
                    <StepThree
                        onPrev={handlePrevStep}
                        onNext={handleNextStep}
                        initialData={formData}
                    />
                );
            case 4:
                return (
                    <StepFour
                        onPrev={handlePrevStep}
                        onConfirm={() => handleSubmit(formData)}
                        formData={formData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <PublicLayout showHeader={false}>
            <Head title={`Enregistrement visiteur - ${place.name}`} />

            <div className="w-full max-w-4xl">
                {/* HEADER */}
                <div className="mb-6 text-white">
                    <div className="mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="border-white/30 text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </div>

                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                        <p className="text-sm text-white/80">Enregistrement pour</p>
                        <h1 className="text-2xl font-bold">{place.name}</h1>
                        {place.typePlace && (
                            <p className="text-sm text-white/70">
                                {place.typePlace.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* CARD PRINCIPALE */}
                <Card className="bg-background/90 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <Stepper currentStep={currentStep} />

                        <CardTitle className="mt-4 text-lg sm:text-xl">
                            {steps[currentStep - 1].label}
                        </CardTitle>

                        <CardDescription>
                            {steps[currentStep - 1].description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {renderStep()}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
