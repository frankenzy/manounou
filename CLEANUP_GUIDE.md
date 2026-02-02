# 🗑️ Nettoyage Progressif - Fichiers à Supprimer

## ⚠️ À LIRE AVANT DE SUPPRIMER

**NE SUPPRIMEZ PAS IMMÉDIATEMENT!**

1. ✅ Testez d'abord que tout fonctionne (`npm run dev`)
2. ✅ Validez que les pages existantes fonctionnent
3. ✅ Assurez-vous qu'aucun fichier n'y dépend
4. ⏳ PUIS, supprimez progressivement

---

## 🗂️ Fichiers à Supprimer (dans cet ordre)

### Phase 1 : Controllers (Pas utilisés)
```
❌ src/controllers/Announcement.controller.ts
❌ src/controllers/UserController.ts
❌ src/controllers/BaseController.ts
❌ src/controllers/Comment.controller.ts
```

**Raison**: Remplacés par Use Cases  
**Quand**: Après validation que les API routes fonctionnent

---

### Phase 2 : Services (Pas utilisés)
```
❌ src/services/AnnouncementService.ts
❌ src/services/IAnnouncementService.ts
❌ src/services/UserService.ts
❌ src/services/IUserService.ts
```

**Raison**: Remplacés par Use Cases  
**Quand**: Après validation que les API routes fonctionnent

---

### Phase 3 : Models (Doublons)
```
❌ src/models/Annnouncements.ts  (faute de frappe!)
❌ src/models/User.model.ts
```

**Raison**: Remplacés par Entities  
**Quand**: Après validation complète

**ATTENTION**: Cherchez d'abord les imports de ces fichiers
```bash
grep -r "from.*models/Annnouncements" src/
grep -r "from.*models/User.model" src/
```

---

### Phase 4 : Anciens Repositories
```
❌ src/repositories/AnnouncementRepository.ts
❌ src/repositories/IAnnouncementRepository.ts
❌ src/repositories/UserRepository.ts
❌ src/repositories/IUserRepository.ts
❌ src/repositories/  (dossier entier si vide)
```

**Raison**: Remplacés par Infrastructure Repositories  
**Quand**: Après validation complète

**ATTENTION**: Cherchez les imports
```bash
grep -r "from.*repositories/" src/
```

---

### Phase 5 : Validators Anciens (Optionnel)
```
✅ src/validators/Announcement.validation.ts  # À GARDER pour l'instant
✅ src/validators/UserValidator.ts           # À GARDER pour l'instant
```

**Pourquoi**: Encore utilisés par l'old code  
**Futur**: À remplacer par les validations dans les Entities

---

## 🔍 Avant de Supprimer - Checklist

### 1. Vérifier qu'aucun fichier n'est importé

```bash
# Chercher tous les imports des fichiers à supprimer
grep -r "from.*controllers/" src/
grep -r "from.*services/" src/
grep -r "from.*repositories/" src/
grep -r "from.*models/" src/
```

**Si des résultats** :
- ✅ Remplacez les imports par les nouveaux (Use Cases, Entities, etc.)
- ✅ Puis supprimez

**Si aucun résultat** :
- ✅ Safe to delete

---

### 2. Vérifier la build

```bash
npm run build

# Devrait compiler sans erreurs
```

---

### 3. Vérifier localement

```bash
npm run dev

# Ouvrir http://localhost:3000
# Tester les pages
# Tester les API routes
```

---

## 🎯 Stratégie de Suppression Recommandée

### Jour 1 (Lundi)
- ✅ Lancez `npm run dev`
- ✅ Testez les pages
- ✅ Testez les API routes
- ✅ Validez que tout fonctionne

### Jour 2-3 (Mardi-Mercredi)
- ✅ Commencez à migrer les pages client
- ✅ Remplacez les imports progressivement
- ✅ Build à chaque changement

### Jour 4-5 (Jeudi-Vendredi)
- ✅ Quand tout est testé et validé
- ✅ Supprimez **Phase 1** (Controllers)
- ✅ Testez et validez
- ✅ Supprimez **Phase 2** (Services)
- ✅ Testez et validez
- ✅ Etc...

### Semaine 2+
- ✅ Supprimez les phases restantes
- ✅ Nettoyage complet

---

## 🚨 Ce qui NE Faut PAS Supprimer

```
✅ GARDER: src/components/           (Toujours utilisé)
✅ GARDER: src/utils/                (Toujours utilisé)
✅ GARDER: src/lib/                  (Toujours utilisé)
✅ GARDER: src/hooks/                (Les anciens, pas en conflit)
✅ GARDER: src/validators/           (Toujours utilisé pour backward compat)
✅ GARDER: src/app/                  (À DÉVELOPPER)
✅ GARDER: src/core/                 (NOUVEAU, IMPORTANT)
✅ GARDER: src/presentation/         (NOUVEAU, IMPORTANT)
✅ GARDER: src/config/               (NOUVEAU, IMPORTANT)
```

---

## 📝 Script Automatisé (Optionnel)

Si vous êtes sûr, vous pouvez utiliser :

```bash
bash cleanup-old-code.sh
```

**ATTENTION**: Ce script supprimera automatiquement les anciens fichiers!  
**À utiliser SEULEMENT après validation complète!**

---

## ❌ Situation de Recours

Si vous avez accidentellement supprimé un fichier important :

```bash
# Récupérer le fichier depuis git
git checkout src/path/to/file.ts
```

---

## ✅ Après Nettoyage

Votre `src/` aura cette structure :

```
src/
├── core/                           # ← NOUVEAU (Keep!)
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
├── presentation/                   # ← NOUVEAU (Keep!)
│   ├── actions/
│   ├── hooks/
│   └── components/
│
├── app/                            # ← EXPAND (Keep!)
│   ├── api/
│   └── ... pages
│
├── config/                         # ← NOUVEAU (Keep!)
│
├── components/                     # ← OLD (Keep for now)
├── utils/                          # ← OLD (Keep!)
├── lib/                            # ← OLD (Keep!)
├── hooks/                          # ← OLD (Keep for now)
└── validators/                     # ← OLD (Keep for backward compat)

# À SUPPRIMER:
# ❌ controllers/
# ❌ services/
# ❌ models/
# ❌ repositories/
```

---

## 🎯 Objectif Final

Une architecture **propre, maintenable, scalable** sans code legacy encombrant.

**Avant**: ~1000 LOC de legacy code  
**Après**: ~300 LOC de legacy code  
**Gain**: 70% de simplification!

---

## 💡 Tips

1. **Supprimez un groupe à la fois**, pas tout d'un coup
2. **Testez après chaque suppression**
3. **Utilisez git** pour rollback si nécessaire
4. **Documentez ce que vous supprimez** (au cas où)

---

**Bon nettoyage! 🧹**
