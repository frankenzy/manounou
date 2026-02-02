/**
 * ARCHITECTURE MIGÉE - Clean Architecture + SOLID + Next.js 13+
 * 
 * ============================================================
 * STRUCTURE DES DOSSIERS
 * ============================================================
 * 
 * src/core/                          # Logique métier centralisée (100% indépendant du framework)
 * ├── domain/                        # Entities (objets métier purs)
 * │   ├── entities/
 * │   │   ├── Announcement.entity.ts # Logique métier Announcement
 * │   │   └── User.entity.ts         # Logique métier User
 * │   └── value-objects/             # Objets valeur (immuables)
 * │
 * ├── application/                   # Use Cases (orchestration de la logique)
 * │   ├── use-cases/                 # Un use case = une action métier
 * │   │   ├── announcement/
 * │   │   │   ├── GetAllAnnouncements.usecase.ts
 * │   │   │   ├── CreateAnnouncement.usecase.ts
 * │   │   │   ├── UpdateAnnouncement.usecase.ts
 * │   │   │   ├── DeleteAnnouncement.usecase.ts
 * │   │   │   ├── SearchAnnouncements.usecase.ts
 * │   │   │   └── ...
 * │   │   └── user/
 * │   │       ├── GetAllUsers.usecase.ts
 * │   │       ├── CreateUser.usecase.ts
 * │   │       └── ...
 * │   ├── dto/                       # Data Transfer Objects
 * │   │   ├── Announcement.dto.ts
 * │   │   └── User.dto.ts
 * │   └── ports/                     # Interfaces (Dependency Inversion)
 * │       ├── IAnnouncementRepository.ts
 * │       └── IUserRepository.ts
 * │
 * └── infrastructure/                # Détails d'implémentation
 *     ├── repositories/              # Implémentations des repos
 *     │   ├── PostgresAnnouncementRepository.ts
 *     │   └── PostgresUserRepository.ts
 *     ├── persistence/               # Gestion BD
 *     ├── validation/                # Validateurs métier
 *     └── ...
 *
 * src/presentation/                  # Couche présentation (Next.js specific)
 * ├── components/
 * │   ├── features/                  # Components par feature
 * │   │   ├── announcements/
 * │   │   └── users/
 * │   └── ui/                        # Shared UI components
 * ├── actions/                       # Server Actions (mutations)
 * │   ├── announcement.actions.ts
 * │   └── user.actions.ts
 * ├── hooks/                         # React hooks custom
 * │   ├── useAnnouncements.ts
 * │   └── useUsers.ts
 * └── views/                         # Pages (Server/Client components)
 *
 * src/app/                           # Next.js 13+ App Router
 * ├── api/                           # API Routes (pour externe)
 * │   ├── announcements/
 * │   │   ├── route.ts               # GET, POST
 * │   │   └── [id]/
 * │   │       └── route.ts           # GET, PUT, DELETE
 * │   └── users/
 * │       ├── route.ts
 * │       └── [id]/
 * │           └── route.ts
 * └── (routes)/                      # Routes groupées
 *     ├── announcements/
 *     │   ├── page.tsx
 *     │   └── [id]/
 * │       └── page.tsx
 *     └── ...
 *
 * src/config/                        # Configuration globale
 * └── di-container.ts                # Injection de dépendances
 *
 * ============================================================
 * FLUX DE DONNÉES
 * ============================================================
 *
 * 1. CLIENT COMPONENT (mutation) :
 *    Client Component → Server Action → Use Case → Repository → DB
 *    
 *    Exemple:
 *    <button onClick={() => createAnnouncementAction(data)}>
 *
 * 2. SERVER COMPONENT (lecture) :
 *    Server Component → Use Case → Repository → DB
 *    
 *    Exemple:
 *    const announcements = await getAllAnnouncementsUseCase.execute();
 *
 * 3. EXTERNAL API :
 *    External Client → API Route → Use Case → Repository → DB
 *    
 *    GET /api/announcements
 *    POST /api/announcements
 *    PUT /api/announcements/[id]
 *    DELETE /api/announcements/[id]
 *
 * 4. CLIENT COMPONENT (lecture via hook) :
 *    Client Component → Hook → fetch('/api/...') → API Route → Use Case → DB
 *
 * ============================================================
 * PRINCIPES SOLID APPLIQUÉS
 * ============================================================
 *
 * ✅ S - Single Responsibility :
 *    - Chaque Use Case = une responsabilité
 *    - Chaque Repository = une ressource
 *    - Séparation nette Domain/Application/Infrastructure
 *
 * ✅ O - Open/Closed :
 *    - Ouvert à l'extension (nouveau Repository, nouveau Use Case)
 *    - Fermé à la modification (interfaces stables)
 *
 * ✅ L - Liskov Substitution :
 *    - Toute implémentation de IRepository peut remplacer une autre
 *
 * ✅ I - Interface Segregation :
 *    - Interfaces minimales et focalisées
 *
 * ✅ D - Dependency Inversion :
 *    - Use Cases dépendent d'interfaces, pas d'implémentations
 *    - DI Container gère les dépendances
 *
 * ============================================================
 * GUIDE D'UTILISATION
 * ============================================================
 *
 * --- Pour SERVER COMPONENT (pas de 'use client') ---
 * 
 * Exemple : src/app/announcements/page.tsx
 * ```tsx
 * import { AnnouncementContainer } from '@/config/di-container';
 * 
 * export default async function AnnouncementsPage() {
 *   const useCase = AnnouncementContainer.getGetAllAnnouncementsUseCase();
 *   const announcements = await useCase.execute();
 *   
 *   return <AnnouncementList data={announcements} />;
 * }
 * ```
 *
 * --- Pour CLIENT COMPONENT (avec 'use client') ---
 * 
 * Exemple avec Hook :
 * ```tsx
 * 'use client';
 * import { useAnnouncements } from '@/presentation/hooks/useAnnouncements';
 * 
 * export default function MyComponent() {
 *   const { announcements, isLoading } = useAnnouncements();
 *   return <div>...</div>;
 * }
 * ```
 * 
 * Exemple avec Server Action :
 * ```tsx
 * 'use client';
 * import { createAnnouncementAction } from '@/presentation/actions/announcement.actions';
 * 
 * export default function CreateForm() {
 *   const handleSubmit = async (data) => {
 *     const result = await createAnnouncementAction(data);
 *     if (result.success) {
 *       // Success
 *     }
 *   };
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 *
 * --- Pour API ROUTES (externe) ---
 * 
 * Déjà créées :
 * - GET /api/announcements
 * - POST /api/announcements
 * - GET/PUT/DELETE /api/announcements/[id]
 * - GET /api/users
 * - POST /api/users
 * - GET/PUT/DELETE /api/users/[id]
 *
 * ============================================================
 * MIGRATION ÉTAPE PAR ÉTAPE
 * ============================================================
 *
 * Fait ✅ :
 * - [x] Créer Domain Layer (Entities)
 * - [x] Créer Application Layer (Use Cases, DTOs, Ports)
 * - [x] Créer Infrastructure Layer (Repositories)
 * - [x] Créer DI Container
 * - [x] Créer Server Actions
 * - [x] Créer API Routes (App Router)
 * - [x] Créer Custom Hooks
 * - [x] Migrer une page (page.tsx)
 *
 * À Faire :
 * - [ ] Migrer toutes les pages client en Server Actions
 * - [ ] Migrer les composants pour utiliser les hooks
 * - [ ] Supprimer les anciens fichiers (controllers, services, models)
 * - [ ] Supprimer src/pages/api/ (remplacé par src/app/api/)
 * - [ ] Tests E2E pour valider le nouveau flux
 *
 * ============================================================
 * AMÉLIORATIONS FUTURES
 * ============================================================
 *
 * 1. CQRS :
 *    - Séparer les commandes (mutations) des requêtes (lectures)
 *
 * 2. Event Sourcing :
 *    - Logger tous les changements dans l'event store
 *
 * 3. DDD (Domain-Driven Design) :
 *    - Agrégats et bounded contexts
 *
 * 4. Tests :
 *    - Unit tests pour Use Cases
 *    - Integration tests pour Repositories
 *    - E2E tests pour les pages
 *
 * 5. Logging & Monitoring :
 *    - Tracer tous les appels aux Use Cases
 *    - Monitorer les erreurs
 *
 * ============================================================
 */

export {};
