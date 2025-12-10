# Configuration Dynamique du Thème

## Vue d'ensemble

Le système de configuration dynamique du thème permet de personnaliser l'apparence de l'application en fonction de la configuration stockée en base de données pour chaque `Place`. La configuration est récupérée **une seule fois** au chargement de l'application et partagée globalement via Zustand.

## Architecture

### 1. Backend - Laravel

#### Modèle `Config`
Le modèle `Config` (`app/Models/Installation/Config.php`) stocke la configuration du thème :
- `content` : JSON contenant toutes les variables du thème
- `place_id` : ID du lieu associé (nullable pour la config par défaut)
- `is_active` : Indique si la config est active

**Note importante** : Chaque utilisateur récupère automatiquement la config de son `Place` via la relation `user->place->getConfig()`.

#### Méthode `getConfig()` sur Place
Le modèle `Place` (`app/Models/Place.php`) possède une méthode `getConfig()` qui :
1. Cherche la config active du lieu
2. Si non trouvée, cherche la config par défaut (place_id = null)
3. Si toujours non trouvée, retourne la dernière config disponible

#### API Endpoint
Route : `/api/config`
- `GET /api/config` - Config pour le lieu de l'utilisateur connecté
- `GET /api/config/{placeId}` - Config pour un lieu spécifique
- `GET /api/config/default` - Config par défaut
- `PUT /api/config/{placeId}` - Mise à jour de la config

#### Middleware Inertia
Le middleware `HandleInertiaRequests` partage automatiquement la configuration initiale :
```php
'themeConfig' => $themeConfig, // Config récupérée via getConfig()
```

### 2. Frontend - React + Zustand

#### Zustand Store (`resources/js/stores/config-store.ts`)
Store global qui gère l'état de la configuration :
- `config` : La configuration actuelle
- `loading` : État de chargement
- `error` : Erreur éventuelle
- `userId` : ID de l'utilisateur actuel
- `placeId` : ID du lieu actuel
- `fetched` : Indique si la config a déjà été récupérée
- `fetchConfig(placeId, userId)` : Récupère la config
- `setConfig(config, userId, placeId)` : Définit la config directement
- `clearConfig()` : Réinitialise le store

**Optimisation & Isolation** :
- Le store ne refetch pas la config si elle a déjà été récupérée pour le même `userId` et `placeId`
- **Changement d'utilisateur détecté** : Quand un nouvel utilisateur se connecte, le store détecte automatiquement le changement via `userId` et récupère la nouvelle config
- Cela garantit que chaque utilisateur voit la config de son propre `Place`, même si un autre utilisateur était connecté auparavant

#### ThemeProvider (`resources/js/components/theme-provider.tsx`)
Composant qui :
1. Reçoit une `initialConfig` en props (depuis Inertia)
2. L'injecte directement dans le store (pas de fetch si config fournie)
3. Applique les variables CSS au `document.documentElement`
4. Gère les états de chargement et d'erreur

#### Hook `useConfig` (`resources/js/hooks/use-config.ts`)
Hook simple pour accéder à la config depuis n'importe où :
```typescript
const { config, loading, error } = useConfig();
```

#### Application des CSS Variables
La fonction `applyThemeConfig()` applique les valeurs de la config aux CSS custom properties :
```javascript
root.style.setProperty('--color-primary', config.primary_color);
root.style.setProperty('--font-family', config.font_family);
// etc...
```

## Utilisation

### 1. Dans les Layouts
Les layouts principaux reçoivent automatiquement la config via Inertia :
```typescript
const { themeConfig } = usePage().props;

return (
    <ThemeProvider initialConfig={themeConfig}>
        {/* Contenu */}
    </ThemeProvider>
);
```

### 2. Dans les Composants
Accédez à la config depuis n'importe quel composant :
```typescript
import { useConfig } from '@/hooks/use-config';

function MyComponent() {
    const { config, loading, error } = useConfig();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error}</div>;

    return (
        <div>
            Couleur primaire : {config?.primary_color}
        </div>
    );
}
```

### 3. Variables CSS Disponibles
Les variables CSS suivantes sont disponibles dans tout le CSS/Tailwind :
- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-background`
- `--color-text`
- `--font-family`
- `--font-size-base`
- `--font-size-title`
- `--font-weight`
- `--border-radius`
- `--shadow-style`

Utilisation en CSS :
```css
.my-element {
    background-color: var(--color-primary);
    font-family: var(--font-family);
}
```

## Flux de Données

```
1. Utilisateur se connecte
   ↓
2. Middleware HandleInertiaRequests récupère la config via user->place->getConfig()
   ↓
3. Config partagée via Inertia props (themeConfig + userId + placeId)
   ↓
4. Layout reçoit themeConfig et le passe à ThemeProvider
   ↓
5. ThemeProvider injecte la config dans le Zustand store avec userId et placeId
   ↓
6. Store compare userId/placeId : si différent, nouvelle config chargée
   ↓
7. CSS variables appliquées au document root
   ↓
8. N'importe quel composant peut accéder à la config via useConfig()
```

### Changement d'Utilisateur

Quand un utilisateur se déconnecte et qu'un autre se connecte :
```
1. User2 (Org2) se connecte
   ↓
2. Middleware récupère config de Org2
   ↓
3. ThemeProvider détecte que userId a changé (User1 → User2)
   ↓
4. Store efface l'ancienne config et charge celle de Org2
   ↓
5. CSS variables mises à jour avec les couleurs de Org2
```

## Optimisations

### 1. Une Seule Requête
La config est récupérée **UNE SEULE FOIS** :
- Au chargement initial via Inertia (pas de fetch API)
- Le store Zustand empêche les refetch inutiles
- Aucune requête supplémentaire pendant la navigation

### 2. Partage Global
Grâce à Zustand :
- Tous les composants partagent la même instance
- Pas de prop drilling
- Re-renders optimisés (seulement les composants qui utilisent la config)

### 3. Cache Navigateur
Les variables CSS persistent même entre les changements de page (SPA).

## Mise à Jour de la Config

Pour mettre à jour la config d'un lieu :
```typescript
import axios from 'axios';

const updateConfig = async (placeId, newConfig) => {
    const response = await axios.put(`/api/config/${placeId}`, {
        content: newConfig
    });

    // Recharger la page ou mettre à jour le store
    window.location.reload(); // Simple
    // OU
    useConfigStore.getState().setConfig(response.data.data); // Plus propre
};
```

## Structure de la Config

Exemple de structure JSON pour `content` :
```json
{
    "primary_color": "#3B82F6",
    "secondary_color": "#8B5CF6",
    "accent_color": "#EC4899",
    "success_color": "#10B981",
    "warning_color": "#F59E0B",
    "danger_color": "#EF4444",
    "background_color": "#FFFFFF",
    "text_color": "#1F2937",
    "font_family": "Inter, sans-serif",
    "font_size_base": "16px",
    "font_size_title": "24px",
    "font_weight": "400",
    "border_radius": "0.5rem",
    "shadow_style": "0 1px 3px 0 rgb(0 0 0 / 0.1)"
}
```

## Ajouter de Nouvelles Variables

Pour ajouter une nouvelle variable CSS :

1. **Mettre à jour le type TypeScript** (`resources/js/stores/config-store.ts`) :
```typescript
export interface ThemeConfig {
    // ... existantes
    new_variable?: string;
}
```

2. **Mettre à jour `applyThemeConfig()`** (`resources/js/hooks/use-theme-config.ts`) :
```typescript
if (config.new_variable) {
    root.style.setProperty('--new-variable', config.new_variable);
}
```

3. **Utiliser dans le CSS** :
```css
.element {
    property: var(--new-variable);
}
```

## Notes Importantes

- La config est **spécifique à chaque utilisateur** via son `Place`
- Si aucune config n'est définie, les valeurs par défaut du CSS sont utilisées
- Les changements de config nécessitent un rechargement de la page
- Le système est compatible avec le dark mode (géré séparément via `useAppearance`)
