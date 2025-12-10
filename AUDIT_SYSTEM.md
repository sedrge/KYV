# Système d'Audit Complet et Sophistiqué

## Vue d'ensemble

Le système d'audit implémenté est une solution professionnelle et complète pour suivre toutes les actions effectuées dans l'application Laravel. Il offre une traçabilité exhaustive des opérations CRUD, des authentifications et des requêtes HTTP importantes.

## Architecture du système

### 1. Modèle Audit (`app/Models/Audit.php`)

Le modèle central qui stocke tous les événements d'audit avec les informations suivantes :
- **Événement** : Type d'action (created, updated, deleted, auth.login, etc.)
- **Entité auditable** : Type et ID du modèle concerné
- **Utilisateur** : ID de l'utilisateur qui a effectué l'action
- **Contexte** : IP, User Agent, URL, méthode HTTP
- **Données** : Anciennes et nouvelles valeurs, métadonnées
- **Tags** : Pour catégoriser les audits

**Méthodes principales :**
- `getChanges()` : Retourne les différences entre anciennes et nouvelles valeurs
- `hasAuditChanges()` : Vérifie si des changements sont présents
- `getTags()` : Récupère les tags associés
- Scopes pour filtrer : `forUser()`, `forEvent()`, `forModel()`, `betweenDates()`, `withTag()`

### 2. Trait Auditable (`app/Traits/Auditable.php`)

Ce trait doit être ajouté à tous les modèles que vous souhaitez auditer.

**Fonctionnalités :**
- Enregistrement automatique des événements created, updated, deleted
- Filtrage des attributs sensibles (password, tokens, etc.)
- Personnalisation via `$auditExclude` et `$auditInclude`
- Méthode `auditEvent()` pour enregistrer des événements personnalisés

**Utilisation :**
```php
use App\Traits\Auditable;

class User extends Authenticatable
{
    use Auditable;

    // Exclure des champs spécifiques de l'audit
    protected $auditExclude = ['password', 'remember_token'];

    // Ou inclure uniquement certains champs
    protected $auditInclude = ['name', 'email', 'place_id'];
}
```

### 3. Service AuditService (`app/Services/AuditService.php`)

Service centralisé pour interagir avec les audits.

**Méthodes principales :**
- `getAudits(array $filters, int $perPage)` : Liste paginée avec filtres
- `getAuditById(int $id)` : Détails d'un audit spécifique
- `getUserAudits(int $userId, int $limit)` : Audits d'un utilisateur
- `getModelAudits(string $modelType, int $modelId, int $limit)` : Audits d'un modèle
- `getRecentAudits(int $hours, int $limit)` : Audits récents
- `getAuditStatistics(array $filters)` : Statistiques complètes
- `logCustomEvent(string $event, ?int $userId, array $metadata, array $tags)` : Enregistrement manuel
- `pruneOldAudits(int $days)` : Nettoyage des anciens audits
- `exportAudits(array $filters)` : Export des audits

### 4. Middleware AuditMiddleware (`app/Http/Middleware/AuditMiddleware.php`)

Middleware optionnel pour auditer les requêtes HTTP.

**Fonctionnalités :**
- Enregistrement automatique des requêtes POST, PUT, PATCH, DELETE
- Détection automatique des événements d'authentification
- Filtrage des données sensibles dans les requêtes
- Tags automatiques (api, authentication, etc.)

**Activation :**
Ajoutez le middleware dans `bootstrap/app.php` ou sur des routes spécifiques.

### 5. Contrôleur AuditController (`app/Http/Controllers/AuditController.php`)

Contrôleur pour la gestion des audits via l'interface web.

**Routes disponibles :**
- `GET /audits` : Liste des audits avec filtres
- `GET /audits/{id}` : Détails d'un audit
- `GET /audits/statistics` : Statistiques d'audit
- `GET /audits/export` : Export CSV des audits
- `GET /audits/user/{userId}` : Audits d'un utilisateur spécifique

### 6. Interface utilisateur (React + Inertia)

Trois pages principales :

#### Index (`resources/js/Pages/Audits/Index.tsx`)
- Liste paginée de tous les audits
- Filtres avancés : utilisateur, événement, type de modèle, dates, recherche
- Export CSV
- Vue compacte avec badges colorés par type d'événement

#### Show (`resources/js/Pages/Audits/Show.tsx`)
- Détails complets d'un audit
- Affichage des changements avec comparaison ancien/nouveau
- Informations contextuelles (IP, User Agent, URL)
- Métadonnées supplémentaires

#### Statistics (`resources/js/Pages/Audits/Statistics.tsx`)
- Dashboard de statistiques
- Graphiques de répartition par événement
- Top utilisateurs les plus actifs
- Activité par type de modèle

## Configuration de la base de données

La table `audits` contient :
- `id` : Identifiant unique
- `event` : Type d'événement
- `auditable_type` et `auditable_id` : Référence polymorphique
- `user_id` : Utilisateur qui a effectué l'action
- `ip_address` : Adresse IP
- `user_agent` : Navigateur/client
- `old_values` et `new_values` : JSON des valeurs
- `metadata` : Informations supplémentaires (JSON)
- `url` : URL de la requête
- `http_method` : Méthode HTTP
- `tags` : Tags pour catégorisation (texte)
- `created_at` : Date de création

**Indexes** pour performances optimales :
- `(auditable_type, auditable_id)`
- `(user_id, created_at)`
- `event`
- `created_at`

## Utilisation

### Audit automatique des modèles

```php
use App\Traits\Auditable;

class Place extends Model
{
    use Auditable;
}

// Toutes les créations, modifications et suppressions seront auditées automatiquement
$place = Place::create(['name' => 'New Place']);
// → Crée un audit avec event='created'

$place->update(['name' => 'Updated Place']);
// → Crée un audit avec event='updated', old_values et new_values

$place->delete();
// → Crée un audit avec event='deleted'
```

### Événements personnalisés

```php
// Via le trait Auditable
$user->auditEvent('custom.action', [
    'action' => 'Performed special operation',
    'details' => 'Some details'
], ['custom', 'important']);

// Via le service
app(AuditService::class)->logCustomEvent(
    'user.password.reset',
    $userId,
    ['method' => 'email'],
    ['security', 'authentication']
);
```

### Consultation des audits

```php
use App\Services\AuditService;

$service = app(AuditService::class);

// Audits d'un utilisateur
$audits = $service->getUserAudits($userId, 50);

// Audits d'un modèle spécifique
$audits = $service->getModelAudits(Place::class, $placeId, 50);

// Audits récents (dernières 24h)
$audits = $service->getRecentAudits(24, 100);

// Statistiques
$stats = $service->getAuditStatistics([
    'start_date' => now()->subDays(30),
    'end_date' => now()
]);
```

### Export des audits

```php
// Via le contrôleur (route /audits/export)
// Génère un CSV avec tous les audits filtrés

// Ou programmatiquement
$audits = app(AuditService::class)->exportAudits([
    'user_id' => 1,
    'event' => 'created',
    'start_date' => now()->subDays(7),
]);
```

### Nettoyage des anciens audits

```php
// Supprimer les audits de plus de 90 jours
$deleted = app(AuditService::class)->pruneOldAudits(90);

// Vous pouvez créer une commande planifiée
// Dans app/Console/Kernel.php ou routes/console.php
$schedule->call(function () {
    app(AuditService::class)->pruneOldAudits(90);
})->monthly();
```

## Tests

Le système d'audit est couvert par des tests complets dans `tests/Feature/AuditTest.php` :

- ✓ Création auditée
- ✓ Modification auditée
- ✓ Suppression auditée
- ✓ Tracking IP et User Agent
- ✓ Accès aux pages d'audit
- ✓ Service de filtrage
- ✓ Génération de statistiques
- ✓ Exclusion des champs sensibles

**Exécuter les tests :**
```bash
php artisan test --filter=AuditTest
```

## Bonnes pratiques

### Sécurité

1. **Filtrage des données sensibles** : Le trait exclut automatiquement les champs sensibles (password, tokens). Ajoutez vos propres exclusions si nécessaire.

2. **Permissions** : Limitez l'accès aux pages d'audit aux administrateurs via des policies ou middleware.

3. **Rétention des données** : Définissez une politique de rétention et nettoyez régulièrement les anciens audits.

### Performance

1. **Indexes** : La table utilise des indexes optimaux pour les requêtes fréquentes.

2. **Pagination** : Utilisez toujours la pagination pour afficher les audits.

3. **Requêtes eager loading** : Le service charge automatiquement les relations (user, auditable) pour éviter le N+1.

4. **Désactivation sélective** : Si vous avez des opérations batch, vous pouvez temporairement désactiver l'audit :
```php
// Note: Nécessiterait une implémentation supplémentaire
// Config::set('audit.enabled', false);
```

### Personnalisation

1. **Événements personnalisés** : Créez vos propres événements pour des actions métier spécifiques.

2. **Tags** : Utilisez les tags pour catégoriser et filtrer facilement les audits.

3. **Métadonnées** : Stockez des informations contextuelles supplémentaires dans le champ metadata.

## Extension future

Le système peut être étendu avec :

1. **Notifications** : Alertes en temps réel pour certains événements critiques
2. **Reporting** : Rapports planifiés par email
3. **Compliance** : Exports formatés pour audits réglementaires
4. **Analytics** : Dashboards avancés avec graphiques temporels
5. **API** : Endpoints RESTful pour accès programmatique
6. **Webhooks** : Notifications externes lors d'événements spécifiques

## Migration des données existantes

Si vous avez déjà des données, aucune migration n'est nécessaire. Le système d'audit commence à enregistrer à partir du moment où vous ajoutez le trait `Auditable` aux modèles.

## Support

Pour toute question ou amélioration, consultez :
- Documentation Laravel : https://laravel.com/docs
- Code source du système d'audit dans `app/Models/Audit.php`, `app/Traits/Auditable.php`, etc.
