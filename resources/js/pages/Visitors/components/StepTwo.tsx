import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plane, Calendar, Clock, MapPin } from 'lucide-react';

interface Props {
  onNext: (data: Record<string, any>) => void;
  onPrev: () => void;
  initialData: Record<string, any>;
}

export default function StepTwo({ onNext, onPrev, initialData }: Props) {
  const [formData, setFormData] = useState({
    travel_type: initialData.travel_type || '',
    arrival_date: initialData.arrival_date || '',
    arrival_time: initialData.arrival_time || '',
    departure_date: initialData.departure_date || '',
    departure_time: initialData.departure_time || '',
    travel_reason: initialData.travel_reason || '',
    next_destination: initialData.next_destination || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleNext = () => {
    onNext(formData);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-background/80 p-6 md:p-10 shadow-xl backdrop-blur space-y-10">

      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-400/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 space-y-10">

        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Plane className="h-5 w-5 text-emerald-500" />
            Informations de voyage
          </h2>
          <p className="text-sm text-muted-foreground">
            Renseignez les détails de votre séjour et déplacement
          </p>
        </div>

        {/* FORM */}
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Type de voyage */}
          <div className="space-y-1">
            <Label>Type de voyage</Label>
            <Select
              value={formData.travel_type}
              onValueChange={(v) =>
                handleSelectChange('travel_type', v)
              }
            >
              <SelectTrigger className="focus:ring-2 focus:ring-emerald-500/40">
                <SelectValue placeholder="Choisissez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="International">
                  🌍 International
                </SelectItem>
                <SelectItem value="National">
                  🏠 National
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Motif */}
          <div className="space-y-1">
            <Label>Motif du voyage</Label>
            <Select
              value={formData.travel_reason}
              onValueChange={(v) =>
                handleSelectChange('travel_reason', v)
              }
            >
              <SelectTrigger className="focus:ring-2 focus:ring-emerald-500/40">
                <SelectValue placeholder="Choisissez le motif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Affaires">💼 Affaires</SelectItem>
                <SelectItem value="Tourisme">🏖️ Tourisme</SelectItem>
                <SelectItem value="Famille">👨‍👩‍👧 Famille</SelectItem>
                <SelectItem value="Études">🎓 Études</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Arrivée date */}
          <div className="space-y-1">
            <Label>Date d’arrivée dans le pays</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleChange}
                className="pl-10 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Arrivée heure */}
          <div className="space-y-1">
            <Label>Arrivée à l’hôtel</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                className="pl-10 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Départ date */}
          <div className="space-y-1">
            <Label>Date de sortie du pays</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                className="pl-10 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Départ heure */}
          <div className="space-y-1">
            <Label>Départ de l’hôtel</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                className="pl-10 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1 md:col-span-2">
            <Label>Prochaine destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                name="next_destination"
                value={formData.next_destination}
                onChange={handleChange}
                placeholder="Ex : Abidjan, Paris, Dakar…"
                className="pl-10 focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="hover:border-indigo-500 hover:text-indigo-600"
          >
            ← Retour
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 text-white shadow-lg hover:scale-[1.04]"
          >
            Suivant →
          </Button>
        </div>
      </div>
    </div>
  );
}
