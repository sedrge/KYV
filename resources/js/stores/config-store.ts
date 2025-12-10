import { create } from 'zustand';
import axios from 'axios';

export interface ThemeConfig {
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    success_color?: string;
    warning_color?: string;
    danger_color?: string;
    background_color?: string;
    text_color?: string;
    font_family?: string;
    font_size_base?: string;
    font_size_title?: string;
    font_weight?: string;
    border_radius?: string;
    shadow_style?: string;
    [key: string]: any;
}

interface ConfigState {
    config: ThemeConfig | null;
    loading: boolean;
    error: string | null;
    placeId: string | null;
    userId: string | null;
    fetched: boolean;

    // Actions
    setConfig: (config: ThemeConfig, userId?: string | null, placeId?: string | null) => void;
    fetchConfig: (placeId?: string | null, userId?: string | null) => Promise<void>;
    clearConfig: () => void;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
    config: null,
    loading: false,
    error: null,
    placeId: null,
    userId: null,
    fetched: false,

    setConfig: (config, userId = null, placeId = null) => {
        set({ config, userId, placeId, fetched: true });
    },

    fetchConfig: async (placeId = null, userId = null) => {
        const state = get();

        // Ne pas refetch si déjà récupéré pour le même utilisateur et le même placeId
        if (state.fetched && state.userId === userId && state.placeId === placeId) {
            return;
        }

        set({ loading: true, error: null, placeId, userId });

        try {
            const url = placeId
                ? `/api/config/${placeId}`
                : '/api/config/default';

            const response = await axios.get(url);
            set({
                config: response.data.data,
                loading: false,
                error: null,
                fetched: true
            });
        } catch (err) {
            console.error('Error fetching theme config:', err);
            set({
                config: null,
                loading: false,
                error: 'Failed to load theme configuration',
                fetched: false
            });
        }
    },

    clearConfig: () => set({
        config: null,
        loading: false,
        error: null,
        placeId: null,
        userId: null,
        fetched: false
    }),
}));
