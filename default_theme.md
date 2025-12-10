# 🧠 Architecture de Configuration Multi-Organisation (SaaS)

Ce document décrit la **bonne stratégie** pour gérer une configuration par défaut
(thème, couleurs, logo, layout…) dans une application **multi-organisation**,
avant toute implémentation technique (Laravel, React, shadcn).

---

## 🎯 Objectif

- Fournir une **configuration par défaut** dès le premier lancement
- Attribuer automatiquement une **configuration indépendante** à chaque organisation
- Permettre à chaque organisation de **personnaliser sa configuration**
- Garantir l’isolation entre les organisations
- Avoir un système **scalable, maintenable et professionnel**

---

## ✅ Principe Fondamental

> **Une configuration par défaut n’est jamais utilisée directement par les organisations.**  
>  
> Elle sert uniquement de **modèle (template)** pour créer des configurations
> propres à chaque organisation.

---

## 🧩 Notre Stratégie Globale

| Élément | Rôle |
|------|------|
| Fichier de configuration | Source de vérité initiale |
| Seeder | Injection automatique au déploiement |
| Base de données | État vivant du système |
| Configuration organisation | Copie indépendante et modifiable |
| UI | Modification contrôlée par l’organisation |

---

## 1️⃣ Configuration par Défaut (Template)

### Caractéristiques
- Existe **avant toute exécution** de l’application
- Versionnée dans Git
- Immuable (ne doit jamais être modifiée dynamiquement)
- Sert uniquement à créer d’autres configurations

### Rôle
- Garantir que l’application **fonctionne dès le premier lancement**
- Fournir une base cohérente à toutes les nouvelles organisations

---

## 2️⃣ Injection en Base de Données (Bootstrapping)

### Pourquoi ?
- Une base vide est une **mauvaise pratique**
- Le système doit être **opérationnel automatiquement**

### Principe
- Lors du déploiement ou de l’installation :
  - Lire la configuration par défaut depuis le fichier
  - L’insérer en base de données **une seule fois**
  - Ne rien recréer si elle existe déjà

### Résultat
- La base contient toujours une configuration par défaut valide
- Aucun besoin de connexion ni d’interface pour la créer

---

## 3️⃣ Création d’une Organisation

### Flux logique

1. Une organisation est créée
2. Le système :
   - Lit la configuration par défaut depuis la base de données
   - Clone cette configuration
   - Associe la copie à la nouvelle organisation

### Conséquence
- Chaque organisation devient **propriétaire de sa configuration**
- Aucune dépendance avec le template ou les autres organisations

---

## 4️⃣ Configuration d’une Organisation

### Propriétés
- Complète (aucun fallback)
- Indépendante
- Modifiable uniquement par l’organisation concernée

### Avantages
- Isolation totale des thèmes
- Simplicité côté frontend
- Performances constantes

---

## 5️⃣ Chargement de l’Application

### Fonctionnement

1. Le backend identifie l’organisation active
2. Il charge **sa configuration**
3. Il l’envoie au frontend
4. Le frontend applique le thème et le layout dynamiquement

> Le frontend ne connaît **qu’une seule chose** : la configuration de l’organisation courante.

---

## 6️⃣ Modification par l’Organisation

- Une interface permet à l’organisation de :
  - changer ses couleurs
  - son thème
  - son logo
  - son layout
- Les modifications :
  - sont enregistrées uniquement pour cette organisation
  - prennent effet immédiatement
  - n’impactent aucune autre organisation

---

## 🟢 Ce Que Cette Architecture Garantit

✅ Application fonctionnelle dès le premier déploiement  
✅ Zéro configuration manuelle obligatoire  
✅ Isolation totale entre organisations  
✅ Scalabilité naturelle  
✅ Compatibilité parfaite avec React + shadcn  
✅ Architecture SaaS professionnelle  

---

## 🚫 Ce Qui Est Volontairement Évité

- Config partagée entre organisations
- Fallbacks complexes dans le code
- Thème créé manuellement après installation
- Dépendance à une interface ou à un admin initial

---

## 🔜 Prochaines Étapes (à venir)

1. Définir le schéma JSON exact de la configuration
2. Créer les tables nécessaires
3. Implémenter le seeder automatique
4. Dupliquer la config à la création d’une organisation
5. Appliquer dynamiquement le thème côté frontend (shadcn)

---

> **Ce document définit la base conceptuelle.
> Le code ne fera que respecter ces décisions.**
