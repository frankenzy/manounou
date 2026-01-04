# Documentation du Projet

Bienvenue dans le projet ! Ce document a pour but d’aider les nouveaux développeurs à comprendre la structure du projet et à faciliter leur prise en main.

## 1. Structure des Répertoires

Le projet est situé dans `/var/www/html/web/backend/NEST/dushdata/`. Voici une description générale des dossiers et fichiers typiques que vous pourriez rencontrer :

- **src/** : Contient le code source principal (contrôleurs, services, modules).
- **config/** : Fichiers de configuration (base de données, environnement).
- **test/** : Tests unitaires et d’intégration.
- **package.json** : Dépendances et scripts npm.
- **README.md** : Informations générales sur le projet.
- **.env** : Variables d’environnement (ne pas versionner).

## 2. Démarrage Rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```
2. **Configuration**
   - Copier `.env.example` en `.env` et adapter les variables.
3. **Lancement du serveur**
   ```bash
   npm run start
   ```

## 3. Bonnes Pratiques

- Respecter la structure des modules NestJS.
- Documenter chaque nouvelle fonctionnalité.
- Écrire des tests pour chaque service ou contrôleur ajouté.
- Utiliser des branches pour chaque nouvelle fonctionnalité ou correction.

## 4. Contribution

- Forker le projet et créer une branche dédiée.
- Soumettre une pull request avec une description claire des changements.

## 5. Ressources Utiles

- [NestJS Documentation](https://docs.nestjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 6. Description du Projet

Ce projet est une API backend développée avec NestJS, destinée à la gestion et l’analyse de données. Elle offre une architecture modulaire facilitant l’ajout de nouvelles fonctionnalités et l’intégration avec divers services.

### État Actuel

- Authentification des utilisateurs
- Gestion des données principales (CRUD)
- Configuration de base pour la connexion à la base de données
- Tests unitaires pour les principaux services

### Fonctionnalités Futures Possibles

- Ajout d’un système de rôles et permissions
- Intégration d’un système de notifications (email, SMS)
- Mise en place d’une documentation API interactive (Swagger)
- Support de la pagination et des filtres avancés sur les endpoints
- Exportation des données au format CSV/Excel
- Intégration avec des services externes (API tierces)
- Tableau de bord d’administration

N’hésitez pas à proposer d’autres idées ou à contribuer à l’évolution du projet !
