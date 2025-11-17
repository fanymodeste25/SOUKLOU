# SOUKLOU - Plateforme de Chat Élève-Professeur

Plateforme de communication en temps réel permettant aux élèves et professeurs d'échanger via un système de chat.

## Fonctionnalités

- 💬 Chat en temps réel entre élèves et professeurs
- 🔐 Authentification sécurisée (JWT)
- 👥 Gestion des rôles (Élève / Professeur)
- 📱 Interface responsive et moderne
- ⚡ Notifications en temps réel

## Technologies

### Backend
- Node.js + Express
- Socket.io (chat temps réel)
- SQLite (base de données)
- JWT (authentification)

### Frontend
- React
- Socket.io-client
- CSS moderne

## Installation

```bash
# Installer toutes les dépendances
npm run install-all

# Lancer l'application (backend + frontend)
npm run dev
```

## Configuration

Créer un fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
JWT_SECRET=votre_secret_jwt_ici
NODE_ENV=development
```

## Utilisation

1. Backend démarre sur http://localhost:5000
2. Frontend démarre sur http://localhost:3000
3. Créer un compte (élève ou professeur)
4. Commencer à chatter !

## Structure du projet

```
SOUKLOU/
├── backend/          # Serveur Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── socket/
│   └── server.js
├── frontend/         # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── package.json
```

## Licence

MIT
