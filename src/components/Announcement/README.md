# 📦 Module Announcement

Module refactorisé pour la gestion des annonces avec séparation claire des responsabilités.

## 🏗️ Architecture

```
src/components/Announcement/
├── index.ts                      # Point d'entrée du module
├── types.ts                      # Types TypeScript partagés
├── AnnouncementModal.tsx         # Orchestrateur principal (Smart Component)
├── AnnouncementForm.tsx          # Composant UI pur (Dumb Component)
├── useAnnouncementForm.ts        # Hook: logique d'état du formulaire
└── useAnnouncementSubmit.ts      # Hook: logique API (POST/PUT)
```

## 📋 Responsabilités

### 🎭 **AnnouncementModal.tsx** - Orchestrateur
- Gestion du modal (ouverture/fermeture)
- Détection du mode (création vs édition)
- Coordination entre le formulaire et l'API
- Gestion des callbacks de succès/erreur

### 🎨 **AnnouncementForm.tsx** - UI Pure
- Affichage du formulaire (textarea, boutons couleur, icônes)
- Composant contrôlé (reçoit state et handlers en props)
- Aucune logique métier
- Facilement testable et réutilisable

### 🔧 **useAnnouncementForm.ts** - Logique Formulaire
- Gestion de l'état du formulaire (inputs, métadonnées, styles)
- Pré-remplissage en mode édition
- Validation et formatage
- Utilitaires (reset, ajustement hauteur textarea)

### 🌐 **useAnnouncementSubmit.ts** - Logique API
- Création d'annonce (POST)
- Modification d'annonce (PUT)
- Gestion des erreurs réseau
- État de chargement (isSubmitting)

### 📦 **types.ts** - Typage
- Interfaces partagées
- Constantes du module
- Contrats entre composants

## 🎯 Utilisation

### Création d'une annonce

```tsx
import { AnnouncementModal } from "@/components/Announcement";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnnouncementModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        console.log("Annonce créée !");
        fetchAnnonces(); // Refresh de la liste
      }}
    />
  );
}
```

### Édition d'une annonce

```tsx
import { AnnouncementModal } from "@/components/Announcement";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncementDTO>();

  const handleEdit = async (id: string) => {
    const response = await fetch(`/api/announcements/${id}`);
    const result = await response.json();
    
    if (result.success) {
      setSelectedAnnouncement(result.data);
      setIsOpen(true);
    }
  };

  return (
    <AnnouncementModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        console.log("Annonce modifiée !");
        fetchAnnonces(); // Refresh de la liste
      }}
      announcement={selectedAnnouncement}
      mode="edit" // Optionnel, détecté automatiquement si announcement est fourni
    />
  );
}
```

## ✅ Avantages de cette architecture

### 🎯 Séparation des responsabilités
- Chaque fichier a une responsabilité unique et claire
- Modifications isolées (changer l'UI n'affecte pas la logique API)

### 🧪 Testabilité
- **AnnouncementForm**: Tests UI avec props mockées
- **useAnnouncementForm**: Tests unitaires de la logique
- **useAnnouncementSubmit**: Tests d'intégration API avec fetch mocké
- **AnnouncementModal**: Tests d'orchestration

### 🔄 Réutilisabilité
- Le formulaire peut être utilisé ailleurs (ex: dans une page inline)
- Les hooks peuvent être utilisés dans d'autres contextes
- Import simplifié via `index.ts`

### 🛠️ Maintenabilité
- Modification du formulaire → Éditer uniquement `AnnouncementForm.tsx`
- Changer l'API → Éditer uniquement `useAnnouncementSubmit.ts`
- Ajouter un champ → Modifier `types.ts` + `useAnnouncementForm.ts` + `AnnouncementForm.tsx`

### 📈 Évolutivité
- Facile d'ajouter de nouveaux hooks (validation, analytics, etc.)
- Possibilité de créer des variantes du formulaire
- Support de nouveaux modes (ex: duplication, brouillon)

## 🔧 Exemple de modification

### Ajouter un nouveau champ "Catégorie"

**1. Modifier `types.ts`:**
```typescript
export interface IMetadata {
  // ... champs existants
  category?: string; // Nouveau champ
}
```

**2. Modifier `useAnnouncementForm.ts`:**
```typescript
const [category, setCategory] = useState("");

// Dans getFormData()
return {
  title: announcementTitle,
  description: inputValue,
  metadata: {
    ...metadata,
    category, // Ajouter le nouveau champ
  },
};
```

**3. Modifier `AnnouncementForm.tsx`:**
```tsx
<select onChange={(e) => onCategoryChange(e.target.value)}>
  <option value="">Sélectionner une catégorie</option>
  <option value="job">Emploi</option>
  <option value="housing">Logement</option>
</select>
```

**Aucune modification nécessaire dans:**
- ❌ `AnnouncementModal.tsx` (orchestration inchangée)
- ❌ `useAnnouncementSubmit.ts` (API générique)

## 🚀 Prochaines améliorations possibles

1. **Validation**: Hook `useAnnouncementValidation` avec Zod
2. **Draft**: Sauvegarde automatique en localStorage
3. **Analytics**: Hook `useAnnouncementAnalytics` pour tracking
4. **Preview**: Composant `AnnouncementPreview` pour aperçu en temps réel
5. **Tests**: Suite complète avec Jest + React Testing Library

## 📝 Conventions

- **Smart Components**: `AnnouncementModal` (logique + orchestration)
- **Dumb Components**: `AnnouncementForm` (UI pure)
- **Hooks custom**: Préfixe `use` + nom descriptif
- **Types**: Interface avec préfixe `I` ou type alias
- **Exports**: Centralisés dans `index.ts`

---

**Auteur**: Refactoring Lead Developer  
**Date**: 24 janvier 2026  
**Version**: 2.0.0
