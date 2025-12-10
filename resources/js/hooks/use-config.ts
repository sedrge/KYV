import { useConfigStore } from '@/stores/config-store';

/**
 * Hook pour accéder à la configuration du thème depuis n'importe où dans l'application
 * La config est récupérée une seule fois au chargement de l'application via ThemeProvider
 */
export const useConfig = () => {
    const config = useConfigStore((state) => state.config);
    const loading = useConfigStore((state) => state.loading);
    const error = useConfigStore((state) => state.error);

    return {
        config,
        loading,
        error,
    };
};
