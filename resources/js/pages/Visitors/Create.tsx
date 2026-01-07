import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import VisitorController, { index } from '@/actions/App/Http/Controllers/VisitorController'
import { type BreadcrumbItem } from '@/types'

import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import StepThree from './components/StepThree'
import StepFour from './components/StepFour'

/* =======================
   STEPS CONFIG
======================= */
const steps = [
  { id: 1, label: 'Documents', description: 'Scan & informations' },
  { id: 2, label: 'Voyage', description: 'Trajet & dates' },
  { id: 3, label: 'Contact', description: 'Selfie & signature' },
  { id: 4, label: 'Confirmation', description: 'Validation finale' },
]

/* =======================
   STEPPER
======================= */
function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex w-full justify-between gap-2">
      {steps.map((step, i) => {
        const active = currentStep === step.id
        const done = currentStep > step.id

        return (
          <div key={step.id} className="relative flex flex-1 justify-center">
            <div className="flex flex-col items-center text-center z-10">
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold
                  transition-all duration-500
                  ${done && 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg'}
                  ${active && 'bg-primary border-primary text-white scale-110 animate-pulse'}
                  ${!active && !done && 'bg-background border-muted text-muted-foreground'}
                `}
              >
                {step.id}
              </div>

              <span className="mt-2 text-xs font-semibold">{step.label}</span>
              <span className="hidden sm:block text-[11px] text-muted-foreground">
                {step.description}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 h-[2px] w-full transition-colors duration-500
                  ${done ? 'bg-emerald-500' : 'bg-muted'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* =======================
   PAGE
======================= */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Visiteurs', href: index().url },
  { title: 'Nouveau visiteur', href: VisitorController.create().url },
]

export default function Create() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, any>>({
    phone_country_code: '+226',
    emergency_contact_country_code: '+226',
  })

  const next = (data: any) => {
    setFormData((p) => ({ ...p, ...data }))
    setCurrentStep((s) => Math.min(s + 1, steps.length))
  }

  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const submit = () => {
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        fd.append(k, v instanceof File ? v : String(v))
      }
    })

    router.post(VisitorController.store().url, fd, {
      onSuccess: () => router.visit(index().url),
    })
  }

  const renderStep = () => (
    <div key={currentStep} className="animate-slideFade">
      {currentStep === 1 && <StepOne onNext={next} initialData={formData} />}
      {currentStep === 2 && <StepTwo onNext={next} onPrev={prev} initialData={formData} />}
      {currentStep === 3 && <StepThree onNext={next} onPrev={prev} initialData={formData} />}
      {currentStep === 4 && (
        <StepFour onPrev={prev} onConfirm={submit} formData={formData} />
      )}
    </div>
  )

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nouveau visiteur" />

      {/* 🌍 IMMERSIVE BACKGROUND */}
      <div className="relative min-h-screen overflow-hidden">
        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 h-full w-full object-cover"
        >
          <source src="/videos/visitor-bg.mp4" type="video/mp4" />
        </video>

        {/* FALLBACK IMAGE */}
        <div className="fixed inset-0 bg-[url('/images/visitor-bg.jpg')] bg-cover bg-center -z-10" />

        {/* OVERLAY */}
        <div className="fixed inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90 backdrop-blur-lg" />

        {/* CONTENT */}
        <div className="relative z-10 flex justify-center px-4 py-12">
          <div className="w-full max-w-5xl space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <Link href={index().url}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div>
                <h1 className="text-3xl font-bold animate-fadeIn">
                  Enregistrement du visiteur
                </h1>
                <p className="text-muted-foreground animate-fadeIn delay-150">
                  Processus sécurisé en plusieurs étapes
                </p>
              </div>
            </div>

            {/* MAIN CARD */}
            <Card className="rounded-3xl bg-card/85 backdrop-blur-xl shadow-2xl border border-muted transition-all hover:shadow-primary/20">
              <CardHeader className="space-y-6">
                <Stepper currentStep={currentStep} />

                <div>
                  <CardTitle className="text-xl animate-fadeIn">
                    {steps[currentStep - 1].label}
                  </CardTitle>
                  <CardDescription className="animate-fadeIn delay-150">
                    {steps[currentStep - 1].description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {renderStep()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* =======================
          ANIMATIONS
      ======================= */}
      <style>{`
        @keyframes slideFade {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideFade {
          animation: slideFade .45s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn .4s ease forwards;
        }
        .animate-fadeIn.delay-150 {
          animation-delay: .15s;
        }
      `}</style>
    </AppLayout>
  )
}
