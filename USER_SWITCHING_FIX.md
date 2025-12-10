# Fix : Problème de Persistance de Config Entre Utilisateurs

## 🐛 Problème Initial

Quand un utilisateur (User1 de Org1) se déconnectait et qu'un autre utilisateur (User2 de Org2) se connectait, **la configuration de Org1 persistait** et s'affichait pour User2 au lieu de la config de Org2.

### Cause

Le Zustand store gardait la config en mémoire avec seulement un flag `fetched: true` et un `placeId`. Quand User2 se connectait, le store pensait avoir déjà la config et ne la récupérait pas, même si c'était celle d'un autre utilisateur.

```typescript
// ❌ Avant (PROBLÈME)
if (state.fetched && state.placeId === placeId) {
    return; // Ne refetch pas, même si c'est un autre user!
}
```

## ✅ Solution Implémentée

### 1. Tracking de l'Utilisateur dans le Store

Ajout du `userId` au state du Zustand store pour identifier quel utilisateur possède la config actuelle :

```typescript
interface ConfigState {
    config: ThemeConfig | null;
    userId: string | null;      // ✅ NOUVEAU
    placeId: string | null;
    // ...
}
```

### 2. Comparaison User + Place

La vérification vérifie maintenant **à la fois** l'utilisateur ET le lieu :

```typescript
// ✅ Après (FIX)
if (state.fetched && state.userId === userId && state.placeId === placeId) {
    return; // Ne refetch que si MÊME user ET MÊME place
}
```

### 3. Détection Automatique du Changement

Le `ThemeProvider` récupère maintenant l'ID de l'utilisateur depuis Inertia :

```typescript
const { auth } = usePage().props;
const userId = auth?.user?.id;
const userPlaceId = auth?.user?.place_id;

// Passe userId + placeId au store
setConfig(initialConfig, userId, userPlaceId);
```

## 🔄 Scénario Complet

### Avant le Fix
```
1. User1 (Org1) se connecte
   → Config Org1 chargée dans le store
   → store: { config: Org1Config, placeId: "org1-id", fetched: true }

2. User1 se déconnecte

3. User2 (Org2) se connecte
   → Store vérifie: fetched=true ET placeId="org2-id" ≠ "org1-id"
   → ❌ DEVRAIT refetch MAIS ne vérifie PAS le userId
   → Config Org1 PERSISTE pour User2
```

### Après le Fix
```
1. User1 (Org1) se connecte
   → Config Org1 chargée dans le store
   → store: { config: Org1Config, userId: "user1-id", placeId: "org1-id", fetched: true }

2. User1 se déconnecte

3. User2 (Org2) se connecte
   → Store vérifie: fetched=true ET userId="user2-id" ≠ "user1-id"
   → ✅ userId DIFFÉRENT → REFETCH
   → Config Org2 chargée
   → store: { config: Org2Config, userId: "user2-id", placeId: "org2-id", fetched: true }
```

## 📝 Fichiers Modifiés

### 1. [resources/js/stores/config-store.ts](resources/js/stores/config-store.ts)
**Changements :**
- Ajout de `userId: string | null` au state
- Mise à jour de `setConfig(config, userId?, placeId?)`
- Mise à jour de `fetchConfig(placeId?, userId?)`
- Vérification : `state.userId === userId && state.placeId === placeId`

### 2. [resources/js/components/theme-provider.tsx](resources/js/components/theme-provider.tsx)
**Changements :**
- Récupération de `userId` depuis `usePage().props.auth.user.id`
- Récupération de `userPlaceId` depuis `auth.user.place_id`
- Passage de ces valeurs à `setConfig(initialConfig, userId, userPlaceId)`

### 3. [resources/js/hooks/use-theme-config.ts](resources/js/hooks/use-theme-config.ts)
**Changements :**
- Ajout du paramètre `userId` à `useThemeConfig(placeId?, userId?)`
- Passage de `userId` à `fetchConfig(placeId, userId)`

## 🎯 Résultat

✅ **Chaque utilisateur voit maintenant la config de son propre Place**
✅ **Le changement d'utilisateur est détecté automatiquement**
✅ **La config est rechargée quand nécessaire**
✅ **Pas de refetch inutile pour le même utilisateur**

## 🧪 Test Manuel

Pour tester le fix :

1. Se connecter avec User1 (Org1)
   - Vérifier que les couleurs de Org1 s'affichent

2. Se déconnecter

3. Se connecter avec User2 (Org2)
   - ✅ Les couleurs de Org2 doivent s'afficher (pas celles de Org1)

4. Rafraîchir la page
   - ✅ Les couleurs de Org2 doivent persister

5. Se déconnecter et se reconnecter avec User2
   - ✅ Pas de requête API (config en cache pour User2)

## 💡 Notes Techniques

### Persistance du Store Zustand

Zustand garde le state en mémoire pendant toute la session du navigateur. C'est pourquoi il est crucial de :
1. Tracker l'utilisateur actuel (`userId`)
2. Comparer avant de réutiliser le cache
3. Réinitialiser si changement détecté

### Isolation des Configurations

Grâce à ce fix :
- Chaque utilisateur a sa propre config isolée
- Les configs ne "fuient" pas entre utilisateurs
- Le système est multi-tenant compatible

## 🔐 Sécurité

La config est toujours récupérée côté serveur via `user->place->getConfig()`, garantissant que :
- Un utilisateur ne peut voir que la config de son Place
- Les permissions sont respectées
- Pas de manipulation côté client possible
