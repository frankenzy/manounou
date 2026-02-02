#!/bin/bash
#
# Script de nettoyage progressif du code ancien
# À exécuter APRÈS validation complète de la migration
#

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== NETTOYAGE DE L'ANCIEN CODE ===${NC}"
echo ""

# Étape 1 : Vérifier que les tests passent
echo -e "${YELLOW}[1/4] Vérification des tests...${NC}"
if npm run test 2>/dev/null; then
    echo -e "${GREEN}✓ Tests passés${NC}"
else
    echo -e "${RED}✗ Les tests ne passent pas. Aborting.${NC}"
    exit 1
fi

# Étape 2 : Supprimer les anciens controllers
echo -e "${YELLOW}[2/4] Suppression des anciens controllers...${NC}"
if [ -d "src/controllers" ]; then
    rm -rf src/controllers
    echo -e "${GREEN}✓ Supprimé: src/controllers/${NC}"
fi

# Étape 3 : Supprimer les anciens services
echo -e "${YELLOW}[3/4] Suppression des anciens services...${NC}"
if [ -d "src/services" ]; then
    rm -rf src/services
    echo -e "${GREEN}✓ Supprimé: src/services/${NC}"
fi

# Étape 4 : Supprimer les anciens models et repositories
echo -e "${YELLOW}[4/4] Suppression des modèles et repositories anciens...${NC}"
if [ -d "src/models" ]; then
    rm -rf src/models
    echo -e "${GREEN}✓ Supprimé: src/models/${NC}"
fi

if [ -d "src/repositories" ]; then
    rm -rf src/repositories
    echo -e "${GREEN}✓ Supprimé: src/repositories/${NC}"
fi

# Vérification finale
echo ""
echo -e "${YELLOW}Vérification finale...${NC}"
npm run build 2>&1 | tail -5

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nettoyage complété avec succès!${NC}"
    echo -e "${GREEN}✓ L'application est prête pour la production!${NC}"
else
    echo -e "${RED}✗ Erreur lors de la build. Restaurez les fichiers supprimés.${NC}"
    exit 1
fi
