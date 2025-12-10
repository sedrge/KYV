# Système de Logos et Configuration Dynamiques

## Vue d'ensemble

Le système de logos et de configuration dynamiques permet à chaque "place" d'avoir sa propre identité visuelle (logos, nom d'organisation, liens footer) qui s'applique automatiquement dans toute l'application.

## Fonctionnement

### Configuration Backend

1. **Modèle `Config`** ([app/Models/Installation/Config.php](app/Models/Installation/Config.php))
   - Stocke la configuration dans un champ JSON `content`
   - Lié à une `Place` via `place_id` (nullable pour configuration globale)
   - Champs importants : `logo_light`, `logo_dark`, `organization_name`, `footer_links`

2. **Méthode `getConfig()` du modèle `Place`** ([app/Models/Place.php](app/Models/Place.php:58-69))
   - Récupère la configuration active de la place
   - Fallback : configuration globale si pas de config spécifique
   - Ordre de priorité :
     1. Config active de la place
     2. Config globale active
     3. Dernière config globale

3. **Middleware Inertia** ([app/Http/Middleware/HandleInertiaRequests.php](app/Http/Middleware/HandleInertiaRequests.php:43-46))
   - Partage automatiquement `themeConfig` à toutes les pages
   - Récupère la config via `$request->user()->place->getConfig()`

### Configuration Frontend

1. **Types TypeScript** ([resources/js/types/index.d.ts](resources/js/types/index.d.ts))
   - Interface `Config` : définit la structure de configuration
   - `SharedData.themeConfig` : disponible dans toutes les pages

2. **Composants de Logo**

   **AppLogo** ([resources/js/components/app-logo.tsx](resources/js/components/app-logo.tsx))
   - Affiche le logo avec le nom de l'organisation
   - Utilisé dans la sidebar
   - Logique :
     - Si `logo_light` existe → affiche l'image uploadée
     - Sinon → affiche `/images/logo1.png` par défaut
     - Nom : `organization_short_name` > `organization_name` > "Laravel Starter Kit"

   **AppLogoIcon** ([resources/js/components/app-logo-icon.tsx](resources/js/components/app-logo-icon.tsx))
   - Version icône du logo
   - Utilisé dans header, layouts d'authentification
   - Logique similaire à AppLogo mais format icône

3. **Footer Dynamique**

   **NavFooter** ([resources/js/components/nav-footer.tsx](resources/js/components/nav-footer.tsx))
   - Affiche les liens du footer
   - Logique :
     - Si `themeConfig.footer_links` existe → utilise ces liens
     - Sinon → utilise les liens par défaut (Africasys, KYV)

   **AppHeader** ([resources/js/components/app-header.tsx](resources/js/components/app-header.tsx))
   - Utilise également `footer_links` pour les liens de navigation droite

## Utilisation

### Uploader un Logo

1. Aller dans **Configurations** → **Créer/Éditer**
2. Sélectionner une Place (ou laisser vide pour configuration globale)
3. Uploader :
   - `logo_light` : Logo pour le thème clair
   - `logo_dark` : Logo pour le thème sombre (optionnel)
4. Les images sont stockées dans `storage/app/public/configs/`

### Personnaliser les Liens Footer

Dans la configuration, ajouter un champ `footer_links` (JSON) :

```json
[
  {
    "title": "Mon Site",
    "href": "https://monsite.com"
  },
  {
    "title": "Documentation",
    "href": "https://docs.monsite.com"
  }
]
```

### Ordre de Priorité des Logos

1. Logo configuré pour la place de l'utilisateur
2. Logo de la configuration globale
3. `/images/logo1.png` (logo par défaut)

## Fallback

Si aucun logo n'est configuré :
- Le système affiche `/images/logo1.png`
- Si ce fichier n'existe pas, affiche l'icône SVG Laravel par défaut

## Emplacements où le Logo Apparaît

- ✅ Sidebar (composant principal avec nom)
- ✅ Header (version icône)
- ✅ Layouts d'authentification (login, register, etc.)
- ✅ Mobile menu

## Emplacements où les Footer Links Apparaissent

- ✅ Sidebar footer
- ✅ Header navigation droite

## Développement

Pour tester avec différents logos :

```bash
# 1. Créer une configuration via l'interface
# 2. Uploader un logo
# 3. Le logo s'affiche automatiquement partout

# Ou via Tinker :
php artisan tinker
$place = Place::first();
$config = Config::create([
    'place_id' => $place->id,
    'content' => [
        'organization_name' => 'Ma Société',
        'organization_short_name' => 'MS',
        'logo_light' => 'configs/mon-logo.png', // après upload manuel
        'footer_links' => [
            ['title' => 'Site', 'href' => 'https://example.com']
        ]
    ],
    'is_active' => true,
]);
```

## Notes Importantes

- Les images doivent être accessibles via `/storage` (lien symbolique requis)
- Le middleware Inertia charge automatiquement la config
- Pas besoin de redémarrer le serveur après upload
- Le build frontend est nécessaire après modification des composants TypeScript
