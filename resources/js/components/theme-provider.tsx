import { applyThemeConfig, type ThemeConfig } from '@/hooks/use-theme-config';
import { useConfigStore } from '@/stores/config-store';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';

interface ThemeProviderProps {
    children: ReactNode;
    placeId?: string | null;
    initialConfig?: ThemeConfig | null;
}

export const ThemeProvider = ({ children, placeId, initialConfig }: ThemeProviderProps) => {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id;
    const userPlaceId = auth?.user?.place_id || placeId;

    const { setConfig, config, loading, error } = useConfigStore();

    // Si une config initiale est fournie, l'utiliser directement sans fetch
    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig, userId, userPlaceId);
        }
    }, [initialConfig, userId, userPlaceId, setConfig]);

    // Appliquer la config aux CSS variables dès qu'elle est disponible
    useEffect(() => {
        if (config && !loading) {
            applyThemeConfig(config);
        }
    }, [config, loading]);

    if (error) {
        console.error('Theme error:', error);
    }

    return <>{children}</>;
};
