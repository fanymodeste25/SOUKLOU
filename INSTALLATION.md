# Guide d'Installation - SOUKLOU

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd SOUKLOU
```

### 2. Installer toutes les dépendances

```bash
npm run install-all
```

Cette commande installera les dépendances du projet racine, du backend et du frontend.

### 3. Configuration du backend

Créer un fichier `.env` dans le dossier `backend/` (ou copier `.env.example`):

```bash
cd backend
cp .env.example .env
```

Modifier le fichier `.env` si nécessaire :

```env
PORT=5000
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Important** : Changez la valeur de `JWT_SECRET` en production !

## Démarrage de l'application

### Option 1 : Démarrer backend et frontend ensemble (recommandé)

Depuis la racine du projet :

```bash
npm run dev
```

Cette commande démarrera :
- Le backend sur http://localhost:5000
- Le frontend sur http://localhost:3000

### Option 2 : Démarrer séparément

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## Utilisation

1. Ouvrez votre navigateur sur http://localhost:3000
2. Créez un compte (choisissez le rôle Élève ou Professeur)
3. Connectez-vous
4. Commencez à chatter !

### Tester le chat

Pour tester la fonctionnalité de chat, vous devrez :

1. Créer deux comptes (un élève et un professeur) en utilisant deux navigateurs différents ou en mode navigation privée
2. Connectez-vous avec les deux comptes
3. Démarrer une conversation
4. Envoyez des messages en temps réel !

## Fonctionnalités

- ✅ Inscription et connexion sécurisées
- ✅ Chat en temps réel avec Socket.io
- ✅ Conversations entre élèves et professeurs
- ✅ Indicateur "en train d'écrire..."
- ✅ Messages non lus
- ✅ Interface responsive

## Structure de la base de données

La base de données SQLite sera créée automatiquement au premier démarrage dans :
`backend/souklou.db`

Elle contient 3 tables :
- `users` : Utilisateurs (élèves et professeurs)
- `conversations` : Conversations entre utilisateurs
- `messages` : Messages échangés

## Dépannage

### Le backend ne démarre pas

- Vérifiez que le port 5000 n'est pas déjà utilisé
- Vérifiez que le fichier `.env` existe dans le dossier `backend/`
- Vérifiez que toutes les dépendances sont installées : `cd backend && npm install`

### Le frontend ne démarre pas

- Vérifiez que le port 3000 n'est pas déjà utilisé
- Vérifiez que toutes les dépendances sont installées : `cd frontend && npm install`

### Les messages ne s'affichent pas en temps réel

- Vérifiez que le backend est bien démarré
- Vérifiez dans la console du navigateur s'il y a des erreurs de connexion WebSocket
- Assurez-vous que l'URL du backend est correcte dans `frontend/src/services/api.js` et `frontend/src/services/socket.js`

## Build pour la production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Les fichiers de production seront générés dans `frontend/dist/`
