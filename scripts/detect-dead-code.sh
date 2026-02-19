#!/bin/bash
# Script pour détecter le code mort dans le projet

echo "🔍 Détection du code mort..."
echo ""

# 1. Check TypeScript unused variables
echo "1️⃣ Vérification TypeScript (unused locals/params)..."
pnpm tsc --noEmit 2>&1 | grep -E "(is declared but never used|is defined but never used)" || echo "✅ Aucune variable/fonction inutilisée détectée"
echo ""

# 2. Find orphan files (no imports)
echo "2️⃣ Recherche de fichiers orphelins (jamais importés)..."
python3 - <<'PY'
import os, re
from collections import defaultdict

exts = {'.ts', '.tsx', '.js', '.jsx'}
files = []
for d, _, fs in os.walk('src'):
    if any(x in d for x in ['node_modules', '.next']): continue
    for f in fs:
        if os.path.splitext(f)[1] in exts:
            files.append(os.path.normpath(os.path.join(d, f)))

file_set = set(files)
import_re = re.compile(r"(?:import|export)\s+(?:[^'\"]*?from\s+)?['\"]([^'\"]+)['\"]")
cand_exts = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx']

def resolve(base_file, spec):
    if not spec or not (spec.startswith('@/') or spec.startswith('.')): return None
    if spec.startswith('@/'):
        base = os.path.normpath(os.path.join('src', spec[2:]))
    else:
        base = os.path.normpath(os.path.join(os.path.dirname(base_file), spec))
    for suf in cand_exts:
        p = os.path.normpath(base + suf)
        if p in file_set: return p
    return None

inbound = {f: 0 for f in files}
for f in files:
    try: text = open(f, encoding='utf-8').read()
    except: continue
    for m in import_re.finditer(text):
        r = resolve(f, m.group(1))
        if r: inbound[r] += 1

# Entry points
entries = []
for f in files:
    n = f.replace('\\', '/')
    bn = os.path.basename(n)
    if n == 'src/middleware.ts' or n.startswith('src/pages/') or \
       (n.startswith('src/app/') and bn.split('.')[0] in {'page', 'layout', 'route', 'loading', 'error', 'not-found', 'template'}):
        entries.append(f)

orphans = [f for f in files if inbound[f] == 0 and f not in entries]
if orphans:
    print(f"⚠️  {len(orphans)} fichier(s) orphelin(s) détecté(s):")
    for f in sorted(orphans)[:20]:
        print(f"   - {f}")
    if len(orphans) > 20:
        print(f"   ... et {len(orphans) - 20} autres")
else:
    print("✅ Aucun fichier orphelin")
PY
echo ""

# 3. Find empty directories
echo "3️⃣ Recherche de dossiers vides..."
EMPTY_DIRS=$(find src -type d -empty 2>/dev/null)
if [ -z "$EMPTY_DIRS" ]; then
    echo "✅ Aucun dossier vide"
else
    echo "⚠️  Dossiers vides trouvés:"
    echo "$EMPTY_DIRS" | sed 's/^/   - /'
fi
echo ""

echo "✅ Analyse terminée!"
