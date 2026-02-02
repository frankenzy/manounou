#!/bin/bash
#
# Checklist de nettoyage du code ancien
# À cocher au fur et à mesure de la validation
#

echo "===== CHECKLIST DE MIGRATION ====="
echo ""
echo "État de migration du projet:"
echo ""

# 1. Vérifier la structure
echo "[✓] Nouvelle structure créée:"
[ -d "src/core/domain/entities" ] && echo "  ✓ Domain Layer" || echo "  ✗ Domain Layer MANQUANT"
[ -d "src/core/application/use-cases" ] && echo "  ✓ Application Layer" || echo "  ✗ Application Layer MANQUANT"
[ -d "src/core/infrastructure/repositories" ] && echo "  ✓ Infrastructure Layer" || echo "  ✗ Infrastructure Layer MANQUANT"
[ -d "src/presentation/actions" ] && echo "  ✓ Server Actions" || echo "  ✗ Server Actions MANQUANTES"
[ -d "src/app/api" ] && echo "  ✓ API Routes (App Router)" || echo "  ✗ API Routes MANQUANTES"
[ -f "src/config/di-container.ts" ] && echo "  ✓ DI Container" || echo "  ✗ DI Container MANQUANT"

echo ""
echo "[✓] API Routes fonctionnelles:"
[ -f "src/app/api/announcements/route.ts" ] && echo "  ✓ GET/POST /api/announcements" || echo "  ✗ MANQUANT"
[ -f "src/app/api/announcements/\[id\]/route.ts" ] && echo "  ✓ GET/PUT/DELETE /api/announcements/[id]" || echo "  ✗ MANQUANT"
[ -f "src/app/api/users/route.ts" ] && echo "  ✓ GET/POST /api/users" || echo "  ✗ MANQUANT"
[ -f "src/app/api/users/\[id\]/route.ts" ] && echo "  ✓ GET/PUT/DELETE /api/users/[id]" || echo "  ✗ MANQUANT"

echo ""
echo "[✓] Server Actions disponibles:"
[ -f "src/presentation/actions/announcement.actions.ts" ] && echo "  ✓ Announcement Actions" || echo "  ✗ MANQUANTES"
[ -f "src/presentation/actions/user.actions.ts" ] && echo "  ✓ User Actions" || echo "  ✗ MANQUANTES"

echo ""
echo "[✓] Anciens fichiers à CONSERVER (compatible):"
[ -d "src/components" ] && echo "  ✓ src/components/ (legacy)" || echo "  ✗ À recreer"
[ -d "src/utils" ] && echo "  ✓ src/utils/" || echo "  ✗ À recreer"
[ -f "src/lib/db.ts" ] && echo "  ✓ src/lib/db.ts" || echo "  ✗ À recreer"

echo ""
echo "[✓] Pages à MIGRER (progressivement):"
echo "  ⏳ src/app/page.tsx"
echo "  ⏳ src/app/announcement/[id]/page.tsx"
echo "  ⏳ src/app/contact/page.tsx"
echo "  ⏳ src/app/register/page.tsx"
echo "  ⏳ src/app/login/page.tsx"
echo "  ⏳ Autres pages..."

echo ""
echo "===== ÉTAPES DE NETTOYAGE ====="
echo ""
echo "APRÈS VALIDATION COMPLÈTE, vous pouvez supprimer :"
echo ""
echo "1. [ ] src/controllers/         (remplacé par Use Cases)"
echo "2. [ ] src/services/            (remplacé par Use Cases)"
echo "3. [ ] src/models/              (remplacé par Entities)"
echo "4. [ ] src/repositories/        (remplacé par Infrastructure)"
echo ""

echo "===== BUILD TEST ====="
cd "$(dirname "$0")" || exit
npm run build 2>&1 | tail -3

echo ""
echo "✅ Checklist terminée!"
echo ""
echo "PROCHAINES ÉTAPES :"
echo "1. Tester l'application avec 'npm run dev'"
echo "2. Valider les API routes avec curl/Postman"
echo "3. Valider les pages existantes"
echo "4. Migrer les pages client progressivement"
echo "5. Exécuter 'bash cleanup-old-code.sh' quand prêt"
