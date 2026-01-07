import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onPrev: () => void
  onConfirm: () => void
  formData: Record<string, any>
}

export default function StepFour({ onPrev, onConfirm, formData }: Props) {
  const [isInfoAccurate, setIsInfoAccurate] = useState(false)

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString('fr-FR') : 'Non renseigné'

  const formatTime = (time?: string) => time || 'Non renseigné'

  const mapLabel = (value: string, map: Record<string, string>) =>
    map[value] || value || 'Non renseigné'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">

      {/* HEADER INFO */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-emerald-500/10 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary animate-pulse" />
          <p className="text-sm font-medium">
            Dernière étape — vérifiez attentivement vos informations avant validation
          </p>
        </div>
      </div>

      {/* INFORMATIONS PERSONNELLES */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Données issues de votre document</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            ['Type de document', mapLabel(formData.document_type, {
              Passport: 'Passeport',
              'ID Card': 'Carte d’identité',
              'Driver License': 'Permis de conduire',
            })],
            ['Numéro', formData.document_number],
            ['Prénom(s)', formData.first_name],
            ['Nom', formData.last_name],
            ['Date de naissance', formatDate(formData.date_of_birth)],
            ['Lieu de naissance', formData.place_of_birth],
            ['Nationalité', formData.nationality],
            ['Profession', formData.profession],
            ['Nom du père', formData.father_name],
            ['Nom de la mère', formData.mother_name],
            ['Adresse', formData.home_address],
            ["Nombre d'enfants", formData.number_of_children || 0],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold">{value || 'Non renseigné'}</p>
            </div>
          ))}

          {formData.document_scan && (
            <div className="md:col-span-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Document scanné
              </p>
              <Badge variant="secondary">{formData.document_scan.name}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* INFORMATIONS VOYAGE */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Informations du voyage</CardTitle>
          <CardDescription>Détails du séjour</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            ['Type de voyage', mapLabel(formData.travel_type, {
              International: 'International',
              National: 'National',
            })],
            ['Motif', formData.travel_reason],
            ['Arrivée pays', formatDate(formData.arrival_date)],
            ['Arrivée hôtel', formatTime(formData.arrival_time)],
            ['Départ pays', formatDate(formData.departure_date)],
            ['Départ hôtel', formatTime(formData.departure_time)],
            ['Prochaine destination', formData.next_destination],
          ].map(([label, value]) => (
            <div key={label} className={label === 'Prochaine destination' ? 'md:col-span-2' : ''}>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold">{value || 'Non renseigné'}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* CONTACT */}
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Coordonnées et urgence</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Téléphone</p>
              <p className="font-semibold">
                {formData.phone_country_code} {formData.phone_number}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-semibold">{formData.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Contact d’urgence</p>
              <p className="font-semibold">{formData.emergency_contact_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Téléphone urgence</p>
              <p className="font-semibold">
                {formData.emergency_contact_country_code} {formData.emergency_contact_phone}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            {formData.selfie && (
              <div>
                <p className="text-xs mb-2">Selfie</p>
                <img
                  src={URL.createObjectURL(formData.selfie)}
                  className="h-28 w-28 rounded-full border-4 border-primary/40 object-cover"
                />
              </div>
            )}

            {formData.signature && (
              <div>
                <p className="text-xs mb-2">Signature</p>
                <img
                  src={URL.createObjectURL(formData.signature)}
                  className="h-24 rounded-md border bg-white p-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CONFIRMATION */}
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-3 items-start">
            <Checkbox
              checked={isInfoAccurate}
              onCheckedChange={(v) => setIsInfoAccurate(v === true)}
            />
            <Label className="text-sm leading-relaxed">
              Je certifie que toutes les informations fournies sont exactes et sincères.
            </Label>
          </div>

          {!isInfoAccurate && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <p className="text-xs">
                Vous devez confirmer l’exactitude avant de continuer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Retour
        </Button>
        <Button
          size="lg"
          disabled={!isInfoAccurate}
          onClick={onConfirm}
          className="bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg hover:scale-[1.02] transition"
        >
          Confirmer & Soumettre
        </Button>
      </div>
    </div>
  )
}
