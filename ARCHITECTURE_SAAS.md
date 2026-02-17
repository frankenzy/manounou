# Architecture SaaS cible (Next.js 15 + App Router)

## 1) Architecture cible

- Type: Modular Monolith orienté feature + Clean Architecture légère.
- Runtime: Next.js App Router (`src/app`) + routes API `app/api/v1`.
- Couches par module:
  - `domain`: entités + contrats
  - `application`: use-cases + DTO
  - `infrastructure`: DB, intégrations externes
  - `presentation`: hooks, clients HTTP, composants
- Multi-tenant strict:
  - contexte workspace via `x-tenant-id` / cookie `tenantId`
  - toutes les requêtes applicatives filtrées par `workspaceId`

## 2) Arborescence cible

```txt
src/
  app/
    api/
      auth/[...nextauth]/route.ts
      v1/
        announcements/route.ts
        announcements/[id]/route.ts
  modules/
    announcements/
      domain/
      application/
      infrastructure/
      presentation/
    auth/
      infrastructure/next-auth/auth.config.ts
  shared/
    application/authorization/
    domain/authorization/
    infrastructure/
      db/prisma/
      billing/
      feature-flags/
      observability/
    lib/
  config/
    feature-flags.ts
prisma/
  schema.prisma
```

## 3) Refactor concret déjà appliqué

- Feature `announcements` refactorisée en vertical slice:
  - contrats domain
  - use-cases application
  - repository Prisma
  - API App Router `v1`
  - client/hook dédiés
- Middleware renforcé:
  - protection routes privées
  - contexte tenant injecté en header
- Socle SaaS ajouté:
  - RBAC rôles/permissions
  - feature flags service
  - client Stripe
  - logger structuré
  - Auth.js (NextAuth v5) + adapter Prisma
- Duplication supprimée:
  - suppression de `src/components/comments/comment copy.tsx`

## 4) Priorités critiques restantes

1. Migrer `users` et `comments` vers `app/api/v1` + modules.
2. Remplacer les `fetch('/api/...')` dispersés par des clients par feature.
3. Supprimer progressivement `src/pages/api/*` legacy après bascule.
4. Ajouter `audit log` applicatif systématique sur actions sensibles.
5. Ajouter rate limiting et protection CSRF sur endpoints mutation.

## 5) Roadmap de migration (équipe 3-10 dev)

### Phase 1 (1 semaine) – fondations
- Installer Prisma, générer client, créer migration initiale.
- Brancher Auth.js + session/tenant context unifié.
- Introduire observabilité de base (logs structurés + trace id).

### Phase 2 (1-2 semaines) – domaines cœur
- Migrer `announcements` (fait).
- Migrer `comments` et `users` sur le même pattern.
- Ajouter tests use-cases + tests API smoke.

### Phase 3 (1 semaine) – SaaS
- Workspace/membership complet (RBAC strict).
- Billing Stripe (checkout, portal, webhook, état abonnement).
- Feature flags par workspace.

### Phase 4 (continue) – scale & hardening
- Caching ciblé + pagination cursor.
- Audit/compliance, alerting, dashboards erreurs/latence.
- Stratégie de migration DB zéro-downtime.
