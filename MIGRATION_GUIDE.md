# 🎯 Guide Refactoring - De l'Ancien vers le Nouveau Système

## 📍 État Actuel

Le projet utilise maintenant une **architecture Clean + SOLID** avec Next.js 13+.

### Architecture :
```
src/core/              → Logique métier pure (indépendante du framework)
src/presentation/      → UI, Actions, Hooks (Next.js specific)
src/app/api/          → API Routes (remplacent src/pages/api/)
```

---

## 🔄 Migration en Cours

### ✅ Fait
- [x] Domain Layer (Entities)
- [x] Application Layer (Use Cases, DTOs, Ports)
- [x] Infrastructure Layer (Repositories)
- [x] DI Container
- [x] Server Actions
- [x] API Routes (App Router)
- [x] Custom Hooks

### ⏳ À Faire (Étape par Étape)

**Étape 1** : Migrer les pages client en utilisant Server Actions + Hooks
**Étape 2** : Remplacer tous les components pour utiliser les nouveaux hooks
**Étape 3** : Supprimer les anciens fichiers (controllers, services)
**Étape 4** : Supprimer src/pages/api/
**Étape 5** : Tests et validation

---

## 📚 Comment Utiliser le Nouveau Système

### Pour une Page Serveur (lecture) :

```tsx
// src/app/announcements/page.tsx
import { AnnouncementContainer } from '@/config/di-container';

export default async function AnnouncementsPage() {
  // Exécuté côté serveur
  const useCase = AnnouncementContainer.getGetAllAnnouncementsUseCase();
  const announcements = await useCase.execute();

  return (
    <div>
      {announcements.map(a => (
        <div key={a.id}>{a.title}</div>
      ))}
    </div>
  );
}
```

### Pour une Mutation (Client + Server Action) :

```tsx
// src/presentation/components/CreateAnnouncementForm.tsx
'use client';

import { createAnnouncementAction } from '@/presentation/actions/announcement.actions';
import { useState } from 'react';

export default function CreateForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const result = await createAnnouncementAction({
      user_id: formData.get('user_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
    });
    
    if (result.success) {
      alert('Créé avec succès!');
    } else {
      alert(`Erreur: ${result.error}`);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* ... */}
    </form>
  );
}
```

### Pour un Hook personnalisé (Client) :

```tsx
// src/presentation/components/AnnouncementList.tsx
'use client';

import { useAnnouncements } from '@/presentation/hooks/useAnnouncements';

export default function AnnouncementList() {
  const { announcements, isLoading, error } = useAnnouncements();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {announcements.map(a => (
        <div key={a.id}>{a.title}</div>
      ))}
    </div>
  );
}
```

---

## 🚀 Prochaine Étape - Migrer une Page

### Exemple : Migrer `src/app/announcement/[id]/page.tsx`

#### AVANT (ancien système) :
```tsx
'use client';
export default function AnnouncementPage({ params }) {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetch(`/api/announcements/${params.id}`)
      .then(r => r.json())
      .then(d => setAnnouncement(d.data));
  }, [params.id]);

  return <div>{announcement?.title}</div>;
}
```

#### APRÈS (nouveau système) :
```tsx
// Pas de 'use client' - Server Component par défaut
import { AnnouncementContainer } from '@/config/di-container';

export default async function AnnouncementPage({ params }) {
  const useCase = AnnouncementContainer.getGetAnnouncementByIdUseCase();
  const announcement = await useCase.execute(parseInt(params.id));

  return <div>{announcement?.title}</div>;
}
```

**Bénéfices** :
- ✅ Pas de waterfall de requests (fetch)
- ✅ Pas d'état côté client
- ✅ SSR automatique
- ✅ Plus simple et plus performant

---

## 📦 Fichiers à Supprimer (Progressivement)

**Anciens Controllers** :
```
src/controllers/
├── Announcement.controller.ts  ❌ Remplacé par Use Cases
├── UserController.ts           ❌ Remplacé par Use Cases
├── BaseController.ts           ❌ Plus nécessaire
└── Comment.controller.ts       ❌ À migrer
```

**Anciens Services** :
```
src/services/
├── AnnouncementService.ts      ❌ Remplacé par Use Cases
├── UserService.ts              ❌ Remplacé par Use Cases
├── IAnnouncementService.ts     ❌ Plus nécessaire
└── IUserService.ts             ❌ Plus nécessaire
```

**Anciens Models** (dupli cates) :
```
src/models/
├── Annnouncements.ts (faute de frappe) ❌ Remplacé par Entities
└── User.model.ts                       ❌ Remplacé par Entities
```

**Anciens Repositories** (will be deprecated) :
```
src/repositories/           ❌ Remplacé par core/infrastructure/repositories
```

**Pages API (ancien pattern)** :
```
src/pages/api/             ❌ Remplacé par src/app/api/
```

---

## ✅ Checklist de Nettoyage

- [ ] Supprimer les controllers
- [ ] Supprimer les services
- [ ] Supprimer les anciens models
- [ ] Supprimer les anciens repositories (src/repositories/)
- [ ] Supprimer src/pages/api/
- [ ] Vérifier que tous les imports sont mis à jour
- [ ] Tester l'application entière
- [ ] Vérifier les logs console

---

## 📞 Questions Fréquentes

**Q: Comment ajouter un nouvel Use Case?**

A: Créez un fichier dans `src/core/application/use-cases/[resource]/[Action].usecase.ts`, puis ajoutez-le au DI Container dans `src/config/di-container.ts`.

**Q: Comment changer de database (PostgreSQL → MongoDB)?**

A: Créez une nouvelle implémentation de `IAnnouncementRepository` en MongoDB, puis changez dans le DI Container. Les Use Cases ne changeront pas.

**Q: Comment tester les Use Cases?**

A: Créez un mock du Repository et passez-le à la place du repository réel.

**Q: Pourquoi SOLID?**

A: Pour que le code soit maintenable, testable, et scalable. C'est la différence entre du code senior et du code junior.

---

## 🎓 Ressources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**Créé le** : 2 février 2026  
**Version** : 1.0  
**Auteur** : Lead Dev (Automated Migration)
