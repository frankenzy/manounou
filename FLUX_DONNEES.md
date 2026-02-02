# 🔄 Flux de Données - Architecture Visuelle

## 1️⃣ Lecture (Server Component)

```
┌─────────────────────────────────────────────────────────────┐
│                     SERVER COMPONENT                        │
│              (src/app/announcements/page.tsx)               │
│                                                             │
│  const announcements = await useCase.execute();            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USE CASE (Application)                     │
│     GetAllAnnouncementsUseCase.execute()                    │
│                                                             │
│  Responsabilité: Orchestrer la logique métier              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORY (Infrastructure)                │
│     IAnnouncementRepository.findAll()                       │
│                                                             │
│  Responsabilité: Accéder aux données                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                              │
│                    PostgreSQL                              │
│                                                             │
│  SELECT * FROM announcements ORDER BY created_at DESC     │
└─────────────────────────────────────────────────────────────┘

RÉSULTAT: ✅ Pas de waterfall, pas de round-trip HTTP supplémentaire
PERF: ⚡ Très rapide (rendu côté serveur)
```

---

## 2️⃣ Lecture (Client Component via Hook)

```
┌─────────────────────────────────────────────────────────────┐
│                  CLIENT COMPONENT                          │
│                  (with 'use client')                       │
│                                                             │
│  const { announcements } = useAnnouncements();            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CUSTOM HOOK                              │
│              (presentation/hooks)                          │
│                                                             │
│  fetch('/api/announcements')                               │
└────────────────────────┬────────────────────────────────────┘
                         │ (HTTP Request)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API ROUTE HANDLER                        │
│              (src/app/api/announcements/route.ts)          │
│                                                             │
│  export async function GET()                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USE CASE (Application)                    │
│     GetAllAnnouncementsUseCase.execute()                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORY (Infrastructure)                │
│     IAnnouncementRepository.findAll()                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                              │
│                    PostgreSQL                              │
└────────────────────────┬────────────────────────────────────┘
                         │ (JSON Response)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              HOOK (State Update)                           │
│        setAnnouncements(data)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT (Re-render)                     │
│                                                             │
│  return <div>{announcements.map(...)}</div>               │
└─────────────────────────────────────────────────────────────┘

RÉSULTAT: ✅ Flux classique avec hook
PERF: ⚡ Caching via fetch API
```

---

## 3️⃣ Mutation (Client Component via Server Action)

```
┌─────────────────────────────────────────────────────────────┐
│                  CLIENT COMPONENT                          │
│           (presentation/components/Form.tsx)              │
│                                                             │
│  <button onClick={() =>                                    │
│    createAnnouncementAction(data)                          │
│  }>                                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVER ACTION                             │
│           (src/presentation/actions/)                      │
│              'use server'                                  │
│                                                             │
│  export async function                                    │
│  createAnnouncementAction(input) {                        │
│    return await useCase.execute(input);                  │
│  }                                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USE CASE (Application)                    │
│     CreateAnnouncementUseCase.execute()                    │
│                                                             │
│  1. Crée une Entity (validation)                           │
│  2. Appelle le Repository                                  │
│  3. Retourne le DTO                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORY (Infrastructure)                │
│     IAnnouncementRepository.create()                       │
│                                                             │
│  INSERT INTO announcements VALUES (...)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                              │
│                    PostgreSQL                              │
│                                                             │
│  ✅ Data saved, ID returned                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RETURN TO CLIENT                              │
│         { success: true, data: {...} }                     │
└─────────────────────────────────────────────────────────────┘

RÉSULTAT: ✅ Sécurisé (côté serveur), Direct (pas de HTTP)
PERF: ⚡ Très rapide, Atomique
```

---

## 4️⃣ EXTERNAL API (Client externe)

```
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL CLIENT                            │
│           (Mobile App, Web 3rd party, etc)                │
│                                                             │
│  curl -X GET                                               │
│  https://api.example.com/api/announcements                │
└────────────────────────┬────────────────────────────────────┘
                         │ (HTTP Request)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API ROUTE HANDLER                        │
│              (src/app/api/announcements/route.ts)          │
│                                                             │
│  export async function GET(request)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USE CASE (Application)                    │
│     GetAllAnnouncementsUseCase.execute()                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORY (Infrastructure)                │
│     IAnnouncementRepository.findAll()                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                              │
└────────────────────────┬────────────────────────────────────┘
                         │ (JSON Response)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           RETURN JSON (HTTP 200)                          │
│                                                             │
│  {                                                          │
│    "success": true,                                        │
│    "data": [...],                                          │
│    "count": 42                                             │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘

RÉSULTAT: ✅ API RESTful classique
PERF: ⚡ Standard HTTP
```

---

## 🏗️ Vue d'Ensemble (Toutes les Couches)

```
                        ┌─────────────────┐
                        │   PRÉSENTATION  │
                        │  (Next.js UI)   │
    ┌───────────────────┼─────────────────┼───────────────────┐
    │                   │                 │                   │
    ▼                   ▼                 ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Server Comp.  │  │Client + Hook │  │Server Action │  │API Route     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       │                 └─────────┬───────┘                 │
       │                           │                         │
       ▼                           ▼                         ▼
    ┌────────────────────────────────────────────────────────┐
    │          APPLICATION LAYER (Use Cases)                │
    │                                                        │
    │  GetAll*, GetById*, Create*, Update*, Delete*, Search*│
    │                                                        │
    │  Responsabilité: Orchestrer la logique métier         │
    └────────────────────────┬───────────────────────────────┘
                             │
                             ▼
    ┌────────────────────────────────────────────────────────┐
    │   DOMAIN LAYER (Entities, Value Objects, Rules)      │
    │                                                        │
    │  AnnouncementEntity, UserEntity, Validations, etc.   │
    │                                                        │
    │  Responsabilité: Logique métier pure (sans dépend.) │
    └────────────────────────┬───────────────────────────────┘
                             │
                             ▼
    ┌────────────────────────────────────────────────────────┐
    │    INFRASTRUCTURE LAYER (Repositories)                │
    │                                                        │
    │  PostgresAnnouncementRepository, PostgresUserRep.     │
    │                                                        │
    │  Responsabilité: Accès aux données                    │
    └────────────────────────┬───────────────────────────────┘
                             │
                             ▼
    ┌────────────────────────────────────────────────────────┐
    │           DATABASE (PostgreSQL)                       │
    │                                                        │
    │  Persistence Layer                                    │
    └────────────────────────────────────────────────────────┘
```

---

## 🎯 Points Clés

### ✅ Avantages du Design
1. **Indépendance** : Chaque couche indépendante
2. **Testabilité** : Facile de mockunner les dépendances
3. **Maintenabilité** : Changements localisés
4. **Scalabilité** : Ajouter de nouvelles features = nouvelle use case
5. **Rétrocompatibilité** : API stable

### 🔄 Flux de Dépendances
```
Presentation → Application → Domain ↔ Infrastructure

(On dépend toujours de ce qui est dessous, jamais de ce qui est dessus)
```

### 💡 Règles d'Or
- Domain Layer = **Aucune dépendance** externe
- Application Layer = Dépend de Domain + Ports
- Infrastructure = Implémente les Ports
- Presentation = Utilise Application via DI Container

---

**Ce design garantit une scalabilité et une maintenabilité optimales! 🚀**
