import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface ColorInputProps {
    label: string;
    name: string;
    value?: string;
    onChange?: (oklchValue: string) => void;
    error?: string;
}

/**
 * Converts hex color to OKLCH format for Shadcn UI
 * @param hex - Hex color (e.g., "#ffffff" or "#fff")
 * @returns OKLCH string (e.g., "oklch(1 0 0)")
 */
function hexToOklch(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Convert RGB to linear RGB
    const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Convert linear RGB to XYZ (using D65 illuminant)
    const x = linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375;
    const y = linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.072175;
    const z = linearR * 0.0193339 + linearG * 0.119192 + linearB * 0.9503041;

    // Convert XYZ to OKLab
    const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
    const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    // Convert OKLab to OKLCH
    const lightness = L;
    const chroma = Math.sqrt(a * a + b_ * b_);
    let hue = Math.atan2(b_, a) * (180 / Math.PI);

    // Normalize hue to 0-360
    if (hue < 0) {
        hue += 360;
    }

    // Round values for cleaner output
    const l = Math.round(lightness * 1000) / 1000;
    const c = Math.round(chroma * 1000) / 1000;
    const h = Math.round(hue * 10) / 10;

    return `oklch(${l} ${c} ${h})`;
}

/**
 * Converts OKLCH format to hex color for display in color picker
 * @param oklch - OKLCH string (e.g., "oklch(1 0 0)")
 * @returns Hex color (e.g., "#ffffff")
 */
function oklchToHex(oklch: string): string {
    // Parse OKLCH values
    const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) {
        return '#000000';
    }

    const L = parseFloat(match[1]);
    const C = parseFloat(match[2]);
    const H = parseFloat(match[3]);

    // Convert OKLCH to OKLab
    const hueRad = (H * Math.PI) / 180;
    const a = C * Math.cos(hueRad);
    const b = C * Math.sin(hueRad);

    // Convert OKLab to XYZ
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const x = 1.2270138511 * l3 - 0.5577999807 * m3 + 0.2812561489 * s3;
    const y = -0.0405801784 * l3 + 1.1122568696 * m3 - 0.0716766787 * s3;
    const z = -0.0763812845 * l3 - 0.4214819784 * m3 + 1.5861632204 * s3;

    // Convert XYZ to linear RGB
    let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
    let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
    let bl = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

    // Apply gamma correction
    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    bl = bl > 0.0031308 ? 1.055 * Math.pow(bl, 1 / 2.4) - 0.055 : 12.92 * bl;

    // Clamp values
    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    bl = Math.max(0, Math.min(1, bl));

    // Convert to hex
    const rHex = Math.round(r * 255)
        .toString(16)
        .padStart(2, '0');
    const gHex = Math.round(g * 255)
        .toString(16)
        .padStart(2, '0');
    const bHex = Math.round(bl * 255)
        .toString(16)
        .padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

export function ColorInput({ label, name, value = '', onChange, error }: ColorInputProps) {
    // Store the hex value for the color picker
    const [hexValue, setHexValue] = useState(() => {
        if (value && value.startsWith('oklch')) {
            return oklchToHex(value);
        }
        return value || '#ffffff';
    });

    // Store the OKLCH value for the hidden input
    const [oklchValue, setOklchValue] = useState(() => {
        if (value && value.startsWith('oklch')) {
            return value;
        }
        return hexToOklch(value || '#ffffff');
    });

    useEffect(() => {
        if (value && value.startsWith('oklch')) {
            setOklchValue(value);
            setHexValue(oklchToHex(value));
        }
    }, [value]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        const newOklch = hexToOklch(newHex);

        setHexValue(newHex);
        setOklchValue(newOklch);

        if (onChange) {
            onChange(newOklch);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="flex items-center gap-3">
                {/* Color picker */}
                <input
                    type="color"
                    value={hexValue}
                    onChange={handleColorChange}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                />

                {/* Text input showing hex value */}
                <Input
                    type="text"
                    value={hexValue}
                    onChange={(e) => {
                        const newHex = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(newHex)) {
                            setHexValue(newHex);
                            if (newHex.length === 7) {
                                const newOklch = hexToOklch(newHex);
                                setOklchValue(newOklch);
                                if (onChange) {
                                    onChange(newOklch);
                                }
                            }
                        }
                    }}
                    placeholder="#ffffff"
                    className="flex-1"
                />

                {/* Hidden input with OKLCH value */}
                <input type="hidden" name={name} value={oklchValue} />

                {/* Preview */}
                <div
                    className="h-10 w-14 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: hexValue }}
                    title={oklchValue}
                />
            </div>

            {/* Display OKLCH value for reference */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Format Shadcn UI: {oklchValue}
            </p>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
