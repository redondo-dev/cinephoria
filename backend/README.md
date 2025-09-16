# Cinephoria

Cinephoria est une application web pour gérer les films, séances et réservations d’un cinéma.  
Ce dépôt contient **le backend** (Node.js, Express, PostgreSQL) et **le frontend** (Angular).

---

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Scripts utiles](#scripts-utiles)
- [Licence](#licence)

---

## Prérequis

- Node.js >= 20
- NPM ou Yarn
- PostgreSQL
- Angular CLI (`npm install -g @angular/cli`)
- Nodemon (pour le développement backend)

---

## Installation

### Backend

1. Cloner le dépôt et accéder au dossier backend :

```bash
git clone <   >
cd backend

2.Installer les dépendances :
npm install

3.Configurer la base de données :

Créez une base PostgreSQL nommée cinephoria.
Copier le fichier .env.example en .env et renseignez vos informations :

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=cinephoria
PORT=3000
NODE_ENV=development

4.Démarrer le serveur en mode développement :
npm run dev
```

Le backend sera accessible sur http://localhost:3000.

5.Configuration

Backend : src/config/database.js pour la configuration Sequelize/PostgreSQL.

Variables sensibles : .env (backend) – ne pas versionner sur Git.

6.Structure du projet
backend/

7.Scripts utiles
Backend

npm run dev : Démarre le serveur en mode développement avec Nodemon.

npm start : Démarre le serveur en production.

Licence
