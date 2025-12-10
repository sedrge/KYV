/**
 * Exemple d'utilisation de la configuration dynamique du thème
 *
 * Ce composant montre comment accéder et utiliser la configuration
 * du thème depuis n'importe où dans l'application.
 */

import { useConfig } from '@/hooks/use-config';

export function ThemeConfigExample() {
    const { config, loading, error } = useConfig();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-muted-foreground">
                    Chargement de la configuration...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                    Erreur lors du chargement de la configuration : {error}
                </p>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <p className="text-sm text-muted-foreground">
                    Aucune configuration disponible
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Configuration du Thème</h2>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Couleurs */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Couleurs</h3>
                    <div className="space-y-2">
                        {config.primary_color && (
                            <div className="flex items-center gap-2">
                                <div
                                    className="size-6 rounded border"
                                    style={{
                                        backgroundColor: config.primary_color
                                    }}
                                />
                                <span className="text-sm">
                                    Primaire : {config.primary_color}
                                </span>
                            </div>
                        )}
                        {config.secondary_color && (
                            <div className="flex items-center gap-2">
                                <div
                                    className="size-6 rounded border"
                                    style={{
                                        backgroundColor: config.secondary_color
                                    }}
                                />
                                <span className="text-sm">
                                    Secondaire : {config.secondary_color}
                                </span>
                            </div>
                        )}
                        {config.accent_color && (
                            <div className="flex items-center gap-2">
                                <div
                                    className="size-6 rounded border"
                                    style={{
                                        backgroundColor: config.accent_color
                                    }}
                                />
                                <span className="text-sm">
                                    Accent : {config.accent_color}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Typographie */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Typographie</h3>
                    <div className="space-y-2 text-sm">
                        {config.font_family && (
                            <p>
                                <strong>Police :</strong> {config.font_family}
                            </p>
                        )}
                        {config.font_size_base && (
                            <p>
                                <strong>Taille de base :</strong>{' '}
                                {config.font_size_base}
                            </p>
                        )}
                        {config.font_size_title && (
                            <p>
                                <strong>Taille titre :</strong>{' '}
                                {config.font_size_title}
                            </p>
                        )}
                        {config.font_weight && (
                            <p>
                                <strong>Poids :</strong> {config.font_weight}
                            </p>
                        )}
                    </div>
                </div>

                {/* Styles */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Styles</h3>
                    <div className="space-y-2 text-sm">
                        {config.border_radius && (
                            <p>
                                <strong>Border radius :</strong>{' '}
                                {config.border_radius}
                            </p>
                        )}
                        {config.shadow_style && (
                            <p>
                                <strong>Ombre :</strong> {config.shadow_style}
                            </p>
                        )}
                    </div>
                </div>

                {/* Exemple d'utilisation */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold">Exemple d'utilisation</h3>
                    <div
                        className="rounded p-4 text-center"
                        style={{
                            backgroundColor:
                                config.primary_color || 'var(--color-primary)',
                            color: 'white',
                            fontFamily:
                                config.font_family || 'var(--font-family)',
                            borderRadius:
                                config.border_radius ||
                                'var(--border-radius)',
                            boxShadow:
                                config.shadow_style || 'var(--shadow-style)'
                        }}
                    >
                        <p className="text-sm font-medium">
                            Élément stylé avec la config
                        </p>
                    </div>
                </div>
            </div>

            {/* Code JSON brut */}
            <details className="rounded-lg border p-4">
                <summary className="cursor-pointer font-semibold">
                    Voir la configuration complète (JSON)
                </summary>
                <pre className="mt-3 overflow-auto rounded bg-muted p-3 text-xs">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </details>
        </div>
    );
}
