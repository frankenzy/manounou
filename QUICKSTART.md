# ⚡ QuickStart - 5 Minutes pour Commencer

## 🚀 Lancez l'Application

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir http://localhost:3000
```

**Voilà! L'app fonctionne avec la nouvelle architecture! ✅**

---

## 🧪 Tester les API Routes

### En Terminal

```bash
# Récupérer toutes les annonces
curl http://localhost:3000/api/announcements

# Créer une annonce
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user1",
    "title": "Test",
    "description": "Test description here",
    "location": "Paris"
  }'

# Récupérer les utilisateurs
curl http://localhost:3000/api/users

# Créer un utilisateur
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

---

## 💻 Comprendre la Structure

### 3 Secondes
- Domain Layer = Logique métier pure
- Application Layer = Orchestration (Use Cases)
- Infrastructure Layer = Accès aux données (Repositories)

### Fichier Important

[src/config/di-container.ts](src/config/di-container.ts) - **C'est le cœur du système!**

---

## 📝 Cas d'Usage Courants

### Je veux lire les annonces (Server Component)

```tsx
// src/app/announcements/page.tsx
import { AnnouncementContainer } from '@/config/di-container';

export default async function AnnouncementsPage() {
  const useCase = AnnouncementContainer.getGetAllAnnouncementsUseCase();
  const announcements = await useCase.execute();
  
  return <div>{announcements.map(a => <div key={a.id}>{a.title}</div>)}</div>;
}
```

### Je veux lire les annonces (Client Component)

```tsx
'use client';
import { useAnnouncements } from '@/presentation/hooks/useAnnouncements';

export default function MyComponent() {
  const { announcements, isLoading } = useAnnouncements();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{announcements.map(a => <div key={a.id}>{a.title}</div>)}</div>;
}
```

### Je veux créer une annonce

```tsx
'use client';
import { createAnnouncementAction } from '@/presentation/actions/announcement.actions';

export default function CreateForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await createAnnouncementAction({
      user_id: formData.get('user_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
    });
    
    if (result.success) {
      alert('✅ Créé!');
    } else {
      alert(`❌ ${result.error}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="user_id" placeholder="User ID" required />
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" required />
      <input name="location" placeholder="Location" required />
      <button type="submit">Créer</button>
    </form>
  );
}
```

---

## 🗂️ Arborescence Simplifiée

```
src/core/
├── domain/entities/          ← Logique métier
├── application/use-cases/    ← Orchestration
└── infrastructure/           ← Base de données

src/presentation/
├── actions/                  ← Server Actions (mutations)
└── hooks/                    ← Custom Hooks (lectures)

src/app/api/                  ← API Routes pour external
src/config/di-container.ts    ← ⭐ DI (très important!)
```

---

## 📚 Documentation Complète

Si vous avez besoin de plus, consultez :

| Fichier | Utilité |
|---------|---------|
| [README_REFACTORING.md](README_REFACTORING.md) | Index complet |
| [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) | Résumé exécutif |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Guide d'utilisation |
| [FLUX_DONNEES.md](FLUX_DONNEES.md) | Visualisez les flux |
| [src/core/ARCHITECTURE.md](src/core/ARCHITECTURE.md) | Architecture détaillée |

---

## ✅ Validation

```bash
# Vérifier que tout fonctionne
npm run build

# Devrait afficher:
# ✓ Compiled successfully in X.Xs
```

---

## 🎓 Vous Avez Appris (et Mis en Pratique)

✅ Clean Architecture (4 couches)  
✅ SOLID Principles  
✅ Dependency Injection  
✅ Repository Pattern  
✅ Use Cases Pattern  
✅ Domain-Driven Design  
✅ Next.js 13+ Server Components & Actions  

---

## 🚀 Prochaines Étapes

1. ✅ Lancez `npm run dev` et explorez
2. ⏳ Migrez progressivement vos pages client
3. ⏳ Ajoutez des tests
4. ⏳ Implémentez CQRS (futur)

---

**Vous êtes maintenant **SENIOR-LEVEL**! 🎉**

*N'hésitez pas à explorer le code et poser des questions!*
