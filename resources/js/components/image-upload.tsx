import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

interface ImageUploadProps {
    name: string;
    label: string;
    description?: string;
    accept?: string;
    error?: string;
    defaultValue?: string;
}

export function ImageUpload({
    name,
    label,
    description,
    accept = 'image/*',
    error,
    defaultValue,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Update the file input
            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-2 py-3 border-b border-border/40 last:border-0">
            <Label htmlFor={name} className="text-sm font-normal">
                {label}
            </Label>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}

            <div className="flex items-start gap-4">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    id={name}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="sr-only"
                />

                {/* Drag and drop area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={`flex-1 min-h-32 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                >
                    {!preview ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="text-sm font-medium text-foreground mb-1">
                                Cliquez pour uploader ou glissez-déposez
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {accept === 'image/x-icon,image/png'
                                    ? 'ICO, PNG (16x16 ou 32x32)'
                                    : 'PNG, JPG, SVG'}
                            </p>
                        </div>
                    ) : (
                        <div className="relative h-full p-4">
                            <img
                                src={preview}
                                alt="Aperçu"
                                className="max-h-48 mx-auto object-contain rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Preview with remove button */}
                {preview && (
                    <div className="flex flex-col gap-2">
                        <div className="w-32 h-32 border rounded-lg overflow-hidden bg-muted flex items-center justify-center relative group">
                            <img
                                src={preview}
                                alt="Aperçu"
                                className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            className="w-32"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Supprimer
                        </Button>
                    </div>
                )}
            </div>

            {error && <InputError message={error} />}
        </div>
    );
}
