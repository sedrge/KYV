import { useEffect } from 'react';
import { useConfigStore, type ThemeConfig } from '@/stores/config-store';

export type { ThemeConfig };

export const useThemeConfig = (placeId?: string | null, userId?: string | null) => {
    const { config, loading, error, fetchConfig } = useConfigStore();

    useEffect(() => {
        fetchConfig(placeId, userId);
    }, [placeId, userId, fetchConfig]);

    return { config, loading, error };
};

export const applyThemeConfig = (config: ThemeConfig | null) => {
    if (!config) return;

    const root = document.documentElement;

    if (config.primary_color) {
        root.style.setProperty('--color-primary', config.primary_color);
    }
    if (config.secondary_color) {
        root.style.setProperty('--color-secondary', config.secondary_color);
    }
    if (config.accent_color) {
        root.style.setProperty('--color-accent', config.accent_color);
    }
    if (config.success_color) {
        root.style.setProperty('--color-success', config.success_color);
    }
    if (config.warning_color) {
        root.style.setProperty('--color-warning', config.warning_color);
    }
    if (config.danger_color) {
        root.style.setProperty('--color-danger', config.danger_color);
    }
    if (config.background_color) {
        root.style.setProperty('--color-background', config.background_color);
    }
    if (config.text_color) {
        root.style.setProperty('--color-text', config.text_color);
    }
    if (config.font_family) {
        root.style.setProperty('--font-family', config.font_family);
    }
    if (config.font_size_base) {
        root.style.setProperty('--font-size-base', config.font_size_base);
    }
    if (config.font_size_title) {
        root.style.setProperty('--font-size-title', config.font_size_title);
    }
    if (config.font_weight) {
        root.style.setProperty('--font-weight', config.font_weight);
    }
    if (config.border_radius) {
        root.style.setProperty('--border-radius', config.border_radius);
    }
    if (config.shadow_style) {
        root.style.setProperty('--shadow-style', config.shadow_style);
    }
};
