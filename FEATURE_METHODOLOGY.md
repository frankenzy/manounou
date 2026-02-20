# 🏗️ MÉTHODOLOGIE FEATURE-BASED NEXT.JS

> **Guide complet pour développer des features propres, simples et maintenables**

---

## 🎯 Principes Fondamentaux

### 1. Une Feature = Un Dossier Autonome
Chaque feature doit être **auto-suffisante** et **isolée**.

### 2. Séparation Claire des Responsabilités
```
UI (composants)
   ↓
Actions (server actions / hooks)
   ↓
Services (logique métier)
   ↓
Repository (accès données)
```

### 3. Règle d'Or : "Vertical Slice"
Tout pour une feature est **regroupé verticalement**, pas éparpillé horizontalement.

---

## 📁 Structure Idéale

```
src/
├── app/                          # Routes & Pages (Next.js App Router)
│   ├── (auth)/                   # Groupe de routes authentifiées
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   └── (public)/                 # Groupe de routes publiques
│       ├── layout.tsx
│       └── page.tsx
│
├── features/                     # 🎯 FEATURES (cœur de l'app)
│   ├── announce/
│   │   ├── components/          # UI spécifique à announce
│   │   │   ├── AnnounceCard.tsx
│   │   │   ├── AnnounceForm.tsx
│   │   │   └── AnnounceList.tsx
│   │   ├── hooks/               # Hooks métier announce
│   │   │   ├── useAnnounces.ts
│   │   │   └── useAnnounceForm.ts
│   │   ├── actions/             # Server Actions Next.js
│   │   │   ├── createAnnounce.ts
│   │   │   ├── updateAnnounce.ts
│   │   │   └── deleteAnnounce.ts
│   │   ├── services/            # Logique métier pure
│   │   │   └── announceService.ts
│   │   ├── repository/          # Accès données (DB/API)
│   │   │   └── announceRepository.ts
│   │   ├── types.ts             # Types TypeScript de la feature
│   │   ├── schema.ts            # Validation Zod (optionnel)
│   │   └── index.ts             # Exports publics
│   │
│   ├── user/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   ├── services/
│   │   ├── repository/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── comment/
│       └── ... (même structure)
│
├── shared/                      # Code RÉELLEMENT partagé
│   ├── components/              # UI générique réutilisable
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── hooks/                   # Hooks génériques
│   │   ├── useDebounce.ts
│   │   └── useIntersection.ts
│   ├── lib/                     # Utilitaires bas niveau
│   │   ├── db.ts
│   │   ├── prisma.ts
│   │   └── s3.ts
│   └── utils/                   # Helpers génériques
│       ├── formatDate.ts
│       └── cn.ts
│
├── types/                       # Types globaux uniquement
│   └── global.d.ts
│
└── config/                      # Configuration
    └── site.ts
```

---

## 🚀 Workflow : Créer une Nouvelle Feature

### Étape 1 : Définir la Feature
**Question :** Quelle est la fonctionnalité métier ?

Exemple : "Publier une annonce"

**Checklist :**
- [ ] Quel est le nom de la feature ? → `announce`
- [ ] Quelles sont les actions métier ? → `create`, `update`, `delete`, `list`
- [ ] Quelles sont les données ? → `title`, `description`, `location`, `authorId`

---

### Étape 2 : Créer la Structure

```bash
mkdir -p src/features/announce/{components,hooks,actions,services,repository}
touch src/features/announce/{types.ts,index.ts}
```

---

### Étape 3 : Définir les Types (Bottom-Up)

**Fichier :** `src/features/announce/types.ts`

```typescript
// Types du domaine métier
export interface Announce {
  id: string;
  authorId: string;
  title: string;
  description: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

// Input pour créer
export interface CreateAnnounceInput {
  title: string;
  description: string;
  location: string;
}

// Input pour update
export interface UpdateAnnounceInput {
  title?: string;
  description?: string;
  location?: string;
}

// Filter pour list
export interface AnnounceFilter {
  location?: string;
  authorId?: string;
  search?: string;
}
```

---

### Étape 4 : Créer le Repository (Data Layer)

**Fichier :** `src/features/announce/repository/announceRepository.ts`

```typescript
import { prisma } from "@/shared/lib/prisma";
import type { Announce, CreateAnnounceInput, UpdateAnnounceInput, AnnounceFilter } from "../types";

export const announceRepository = {
  async findMany(filter: AnnounceFilter = {}): Promise<Announce[]> {
    return prisma.announce.findMany({
      where: {
        location: filter.location,
        authorId: filter.authorId,
        OR: filter.search ? [
          { title: { contains: filter.search, mode: "insensitive" } },
          { description: { contains: filter.search, mode: "insensitive" } },
        ] : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string): Promise<Announce | null> {
    return prisma.announce.findUnique({ where: { id } });
  },

  async create(authorId: string, data: CreateAnnounceInput): Promise<Announce> {
    return prisma.announce.create({
      data: { ...data, authorId },
    });
  },

  async update(id: string, data: UpdateAnnounceInput): Promise<Announce> {
    return prisma.announce.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.announce.delete({ where: { id } });
  },
};
```

**🎯 Responsabilité :** Accès données uniquement, pas de logique métier.

---

### Étape 5 : Créer le Service (Business Logic)

**Fichier :** `src/features/announce/services/announceService.ts`

```typescript
import { announceRepository } from "../repository/announceRepository";
import type { Announce, CreateAnnounceInput, UpdateAnnounceInput, AnnounceFilter } from "../types";

export const announceService = {
  async listAnnounces(filter: AnnounceFilter): Promise<Announce[]> {
    // Logique métier : validation, transformation, etc.
    return announceRepository.findMany(filter);
  },

  async getAnnounce(id: string): Promise<Announce> {
    const announce = await announceRepository.findById(id);
    if (!announce) {
      throw new Error("Announce not found");
    }
    return announce;
  },

  async createAnnounce(authorId: string, input: CreateAnnounceInput): Promise<Announce> {
    // ✅ Logique métier : validation
    if (input.title.length < 5) {
      throw new Error("Title too short");
    }
    
    return announceRepository.create(authorId, input);
  },

  async updateAnnounce(id: string, authorId: string, input: UpdateAnnounceInput): Promise<Announce> {
    // ✅ Logique métier : vérifier propriétaire
    const existing = await announceRepository.findById(id);
    if (!existing) {
      throw new Error("Announce not found");
    }
    if (existing.authorId !== authorId) {
      throw new Error("Unauthorized");
    }

    return announceRepository.update(id, input);
  },

  async deleteAnnounce(id: string, authorId: string): Promise<void> {
    const existing = await announceRepository.findById(id);
    if (!existing) {
      throw new Error("Announce not found");
    }
    if (existing.authorId !== authorId) {
      throw new Error("Unauthorized");
    }

    await announceRepository.delete(id);
  },
};
```

**🎯 Responsabilité :** Logique métier pure (validation, règles business).

---

### Étape 6 : Créer les Server Actions (Next.js App Router)

**Fichier :** `src/features/announce/actions/createAnnounce.ts`

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { announceService } from "../services/announceService";
import type { CreateAnnounceInput } from "../types";

export async function createAnnounce(authorId: string, input: CreateAnnounceInput) {
  try {
    const announce = await announceService.createAnnounce(authorId, input);
    
    // Invalider cache Next.js
    revalidatePath("/announces");
    
    return { success: true, data: announce };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
```

**Fichier :** `src/features/announce/actions/index.ts`

```typescript
export { createAnnounce } from "./createAnnounce";
export { updateAnnounce } from "./updateAnnounce";
export { deleteAnnounce } from "./deleteAnnounce";
```

**🎯 Responsabilité :** Pont entre UI et Service, gestion cache Next.js.

---

### Étape 7 : Créer les Hooks (Client Side)

**Fichier :** `src/features/announce/hooks/useAnnounces.ts`

```typescript
"use client";

import { useState, useEffect } from "react";
import { listAnnouncesAction } from "../actions";
import type { Announce, AnnounceFilter } from "../types";

export function useAnnounces(filter: AnnounceFilter = {}) {
  const [announces, setAnnounces] = useState<Announce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnounces() {
      setLoading(true);
      try {
        const result = await listAnnouncesAction(filter);
        if (result.success) {
          setAnnounces(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to fetch announces");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnounces();
  }, [filter.location, filter.search]);

  return { announces, loading, error };
}
```

**🎯 Responsabilité :** État client, gestion loading/error.

---

### Étape 8 : Créer les Composants UI

**Fichier :** `src/features/announce/components/AnnounceCard.tsx`

```typescript
import type { Announce } from "../types";

interface AnnounceCardProps {
  announce: Announce;
  onDelete?: (id: string) => void;
}

export function AnnounceCard({ announce, onDelete }: AnnounceCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{announce.title}</h3>
      <p className="text-gray-600">{announce.description}</p>
      <div className="flex justify-between mt-4">
        <span className="text-sm text-gray-500">{announce.location}</span>
        {onDelete && (
          <button onClick={() => onDelete(announce.id)} className="text-red-500">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
```

**Fichier :** `src/features/announce/components/AnnounceForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { createAnnounce } from "../actions";
import type { CreateAnnounceInput } from "../types";

export function AnnounceForm({ authorId }: { authorId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const input: CreateAnnounceInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
    };

    const result = await createAnnounce(authorId, input);
    
    if (result.success) {
      alert("Announce created!");
      (e.target as HTMLFormElement).reset();
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Title" required className="w-full border p-2" />
      <textarea name="description" placeholder="Description" required className="w-full border p-2" />
      <input name="location" placeholder="Location" required className="w-full border p-2" />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Creating..." : "Create Announce"}
      </button>
    </form>
  );
}
```

**🎯 Responsabilité :** Uniquement UI et interactions utilisateur.

---

### Étape 9 : Exporter Publiquement

**Fichier :** `src/features/announce/index.ts`

```typescript
// Components
export { AnnounceCard } from "./components/AnnounceCard";
export { AnnounceForm } from "./components/AnnounceForm";
export { AnnounceList } from "./components/AnnounceList";

// Actions
export * from "./actions";

// Hooks
export { useAnnounces } from "./hooks/useAnnounces";

// Types (pour autres features)
export type * from "./types";
```

**🎯 Responsabilité :** API publique de la feature. Tout le reste est privé.

---

### Étape 10 : Utiliser dans une Page

**Fichier :** `src/app/(auth)/announces/page.tsx`

```typescript
import { AnnounceList } from "@/features/announce";

export default function AnnouncesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Announces</h1>
      <AnnounceList />
    </div>
  );
}
```

**✅ Simple, propre, découplé !**

---

## 🎯 Règles d'Or

### 1. **Une Feature = Un Namespace**
```typescript
// ✅ BON
import { AnnounceCard, createAnnounce } from "@/features/announce";

// ❌ MAUVAIS
import { AnnounceCard } from "@/components/AnnounceCard";
import { createAnnounce } from "@/actions/announces";
```

### 2. **Dépendances : Top-Down Uniquement**
```
Page → Component → Hook → Action → Service → Repository
```

**❌ Interdit :** Repository ne doit **jamais** importer Service.

### 3. **Shared = Vraiment Partagé**
Si un composant est utilisé par **1 seule feature** → il reste dans la feature.

Si utilisé par **2+ features** → déplacer dans `shared/`.

### 4. **Pas de Logique Métier dans les Composants**
```typescript
// ❌ MAUVAIS
function AnnounceCard({ announce }) {
  if (announce.title.length < 5) {  // ❌ Logique métier dans UI
    return <div>Invalid</div>;
  }
}

// ✅ BON
function AnnounceCard({ announce }) {
  return <div>{announce.title}</div>;
}
```

### 5. **Types Co-localisés**
Chaque feature a son `types.ts`. Pas de méga `types/index.ts` global.

### 6. **Tests Co-localisés**
```
src/features/announce/
├── services/
│   ├── announceService.ts
│   └── announceService.test.ts  ✅
```

---

## ⚠️ Erreurs à Éviter

### 1. ❌ Feature Trop Grosse
**Symptôme :** + de 15 fichiers dans une feature.

**Solution :** Découper en sous-features.

```
src/features/
├── announce/
│   ├── create/         # Sous-feature
│   ├── edit/           # Sous-feature
│   └── list/           # Sous-feature
```

### 2. ❌ Dépendances Circulaires
```typescript
// ❌ MAUVAIS
// announce/index.ts
import { User } from "@/features/user";

// user/index.ts
import { Announce } from "@/features/announce";
```

**Solution :** Créer un type partagé dans `shared/types/`.

### 3. ❌ Tout dans Shared
Si `shared/` devient un fourre-tout → c'est raté.

**Règle :** Shared = Max 20% du code total.

### 4. ❌ Logique Dupliquée
Si 2 features ont la même logique → créer un helper dans `shared/utils/`.

### 5. ❌ Actions Trop Complexes
```typescript
// ❌ MAUVAIS : 200 lignes de logique dans l'action
export async function createAnnounce() {
  // 200 lignes...
}

// ✅ BON : Action = juste un wrapper
export async function createAnnounce(input) {
  return announceService.create(input);
}
```

---

## 🔧 Quand Refactorer ?

### Signal 1 : Tu ne sais plus où mettre un fichier
→ Structure à revoir.

### Signal 2 : Import chain > 4 niveaux
```typescript
Page → Component → Hook → Action → Service → Repository (OK)
Page → Component → Hook → Helper → Action → Service → Repository (❌ Trop profond)
```

### Signal 3 : Duplication Code
Si tu copies-colles du code entre features → créer un shared.

### Signal 4 : Feature > 1000 lignes
Découper en sous-features.

---

## 🧩 Gérer les Dépendances entre Features

### Cas 1 : Feature B utilise Feature A

**Exemple :** `comment` dépend de `announce`

```typescript
// ✅ BON
import { Announce } from "@/features/announce";

// Dans comment/types.ts
export interface Comment {
  announceId: string;  // ✅ Juste l'ID
  // ...
}
```

### Cas 2 : Features Mutuellement Dépendantes

**Solution :** Créer une feature parente ou shared type.

```
src/features/
├── social/              # Feature parente
│   ├── announce/
│   ├── comment/
│   └── types.ts         # Types communs
```

---

## 📊 Checklist Nouvelle Feature

- [ ] Créer dossier `src/features/[nom]/`
- [ ] Définir `types.ts`
- [ ] Créer `repository/` (accès data)
- [ ] Créer `services/` (logique métier)
- [ ] Créer `actions/` (server actions)
- [ ] Créer `hooks/` (si client-side)
- [ ] Créer `components/` (UI)
- [ ] Exporter API publique dans `index.ts`
- [ ] Utiliser dans page
- [ ] Tests unitaires

---

## 🎓 Résumé Final

### Architecture en 1 Phrase
**"Chaque feature est autonome avec ses types, sa logique, ses composants et son accès data."**

### Flow de Développement
```
1. Types → 2. Repository → 3. Service → 4. Actions → 5. Hooks → 6. Components → 7. Page
```

### Mantra
- ✅ **Simple** : Junior peut comprendre
- ✅ **Isolé** : Feature supprimable facilement
- ✅ **Testé** : Tests co-localisés
- ✅ **Typé** : TypeScript strict
- ✅ **Scalable** : + features = même structure

---

**🚀 Tu as maintenant une méthodologie complète et reproductible !**
