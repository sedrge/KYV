import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        onNext(formData);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="travel_type">Type de voyage</Label>
                    <Select name="travel_type" value={formData.travel_type} onValueChange={(value) => handleSelectChange('travel_type', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisissez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="International">International</SelectItem>
                            <SelectItem value="National">National</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="travel_reason">Motif de votre voyage</Label>
                    <Select name="travel_reason" value={formData.travel_reason} onValueChange={(value) => handleSelectChange('travel_reason', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisissez le motif" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Affaires">Affaires</SelectItem>
                            <SelectItem value="Tourisme">Tourisme</SelectItem>
                            <SelectItem value="Famille">Famille</SelectItem>
                            <SelectItem value="Études">Études</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="arrival_date">Date d'arrivée dans le pays</Label>
                    <Input
                        id="arrival_date"
                        name="arrival_date"
                        type="date"
                        value={formData.arrival_date}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="arrival_time">Arrivée à l'hôtel</Label>
                    <Input
                        id="arrival_time"
                        name="arrival_time"
                        type="time"
                        value={formData.arrival_time}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="departure_date">Date de sortie du pays</Label>
                    <Input
                        id="departure_date"
                        name="departure_date"
                        type="date"
                        value={formData.departure_date}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="departure_time">Départ de l'hôtel</Label>
                    <Input
                        id="departure_time"
                        name="departure_time"
                        type="time"
                        value={formData.departure_time}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="next_destination">Prochaine destination</Label>
                    <Input
                        id="next_destination"
                        name="next_destination"
                        value={formData.next_destination}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={onPrev}>
                    Retour
                </Button>
                <Button type="button" onClick={handleNext}>
                    Suivant
                </Button>
            </div>
        </div>
    );
}
 