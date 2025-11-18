# SOUKLOU - Plateforme Éducative Complète

Plateforme de communication et de gestion de devoirs en temps réel pour élèves et professeurs.

## Fonctionnalités

### Communication
- 💬 Chat en temps réel entre élèves et professeurs
- 🔔 Système de notifications en temps réel
- ✉️ Indicateur de messages non lus
- ⌨️ Indicateur "en train d'écrire..."

### Gestion des Devoirs
- 📚 Création de devoirs par les professeurs
- 📝 Soumission de copies par les élèves
- ✏️ Correction et commentaires des professeurs
- 📊 Suivi des devoirs (soumis/corrigé)
- 💬 Les élèves peuvent observer les commentaires du professeur
- 👀 Les professeurs peuvent regarder les copies et laisser des commentaires

### Sécurité et Gestion
- 🔐 Authentification sécurisée (JWT)
- 👥 Gestion des rôles (Élève / Professeur)
- 🔒 Permissions basées sur les rôles
- 📱 Interface responsive et moderne

## Technologies

### Backend
- Node.js + Express
- Socket.io (communication temps réel)
- SQLite (base de données)
- JWT (authentification)
- Better-SQLite3 (ORM)

### Frontend
- React + Vite
- Socket.io-client
- CSS moderne responsive

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
FRONTEND_URL=http://localhost:3000
```

## Utilisation

1. Backend démarre sur http://localhost:5000
2. Frontend démarre sur http://localhost:3000
3. Créer un compte (élève ou professeur)
4. Profiter de toutes les fonctionnalités !

## Guide d'utilisation

### Pour les Professeurs

1. **Créer un devoir**
   - Accéder à l'onglet "Devoirs"
   - Cliquer sur "+ Créer un devoir"
   - Remplir titre, description et date limite
   - Valider

2. **Corriger des copies**
   - Sélectionner un devoir
   - Voir la liste des copies soumises
   - Cliquer sur une copie pour la lire
   - Ajouter des commentaires
   - Attribuer une note (optionnel)

3. **Communiquer**
   - Utiliser le chat pour échanger avec les élèves
   - Recevoir des notifications pour les nouvelles soumissions

### Pour les Élèves

1. **Soumettre un devoir**
   - Accéder à l'onglet "Devoirs"
   - Sélectionner un devoir
   - Rédiger la réponse
   - Soumettre

2. **Voir les corrections**
   - Accéder à l'onglet "Devoirs"
   - Sélectionner un devoir soumis
   - Lire les commentaires du professeur
   - Voir la note (si attribuée)

3. **Recevoir des notifications**
   - Badge sur l'icône notifications
   - Notification en temps réel pour:
     - Nouveaux devoirs
     - Commentaires des professeurs
     - Messages reçus

## Structure du projet

```
SOUKLOU/
├── backend/                    # Serveur Node.js
│   ├── src/
│   │   ├── controllers/        # Logique métier
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── assignmentController.js
│   │   │   ├── submissionController.js
│   │   │   ├── commentController.js
│   │   │   └── notificationController.js
│   │   ├── models/             # Modèles de données
│   │   │   ├── User.js
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   ├── Assignment.js
│   │   │   ├── Submission.js
│   │   │   ├── Comment.js
│   │   │   └── Notification.js
│   │   ├── routes/             # Routes API
│   │   ├── middleware/         # Authentification
│   │   └── socket/             # Socket.io handlers
│   ├── server.js
│   └── .env
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx   # Navigation principale
│   │   │   ├── Chat.jsx
│   │   │   ├── AssignmentList.jsx
│   │   │   ├── AssignmentDetail.jsx
│   │   │   ├── CreateAssignment.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── ...
│   │   ├── services/           # API & Socket.io
│   │   └── App.jsx
│   └── public/
├── package.json
└── README.md
```

## Base de données

### Tables

- **users**: Utilisateurs (élèves et professeurs)
- **conversations**: Conversations entre utilisateurs
- **messages**: Messages du chat
- **assignments**: Devoirs créés par les professeurs
- **submissions**: Copies soumises par les élèves
- **comments**: Commentaires des professeurs sur les copies
- **notifications**: Notifications pour les utilisateurs

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Chat
- `GET /api/chat/conversations` - Liste des conversations
- `POST /api/chat/conversations` - Créer une conversation
- `GET /api/chat/conversations/:id/messages` - Messages d'une conversation
- `POST /api/chat/conversations/:id/messages` - Envoyer un message

### Devoirs
- `GET /api/assignments` - Liste des devoirs
- `POST /api/assignments` - Créer un devoir (professeur)
- `GET /api/assignments/:id` - Détails d'un devoir
- `PUT /api/assignments/:id` - Modifier un devoir (professeur)
- `DELETE /api/assignments/:id` - Supprimer un devoir (professeur)

### Soumissions
- `GET /api/submissions/my-submissions` - Mes soumissions (élève)
- `POST /api/submissions` - Soumettre un devoir (élève)
- `GET /api/submissions/:id` - Détails d'une soumission
- `GET /api/submissions/assignment/:id` - Soumissions d'un devoir (professeur)
- `PUT /api/submissions/:id` - Modifier/noter une soumission

### Commentaires
- `POST /api/comments` - Ajouter un commentaire (professeur)
- `GET /api/comments/submission/:id` - Commentaires d'une soumission
- `PUT /api/comments/:id` - Modifier un commentaire (professeur)
- `DELETE /api/comments/:id` - Supprimer un commentaire (professeur)

### Notifications
- `GET /api/notifications` - Liste des notifications
- `GET /api/notifications/unread` - Notifications non lues
- `GET /api/notifications/unread-count` - Nombre de notifications non lues
- `PUT /api/notifications/:id/read` - Marquer comme lu
- `PUT /api/notifications/mark-all-read` - Tout marquer comme lu

## WebSocket Events

### Chat
- `send_message` - Envoyer un message
- `new_message` - Nouveau message reçu
- `typing` - Utilisateur en train d'écrire
- `stop_typing` - Utilisateur a arrêté d'écrire
- `mark_as_read` - Marquer messages comme lus

### Notifications
- `new_notification` - Nouvelle notification reçue
- `mark_notification_read` - Marquer notification comme lue
- `mark_all_notifications_read` - Tout marquer comme lu

## Fonctionnalités Clés

### Système de Notifications
- Notifications automatiques pour:
  - Nouveau devoir publié (→ élèves)
  - Nouvelle soumission (→ professeur)
  - Nouveau commentaire (→ élève concerné)
  - Nouveau message dans le chat
- Badge de compteur en temps réel
- Marquage automatique comme lu

### Gestion des Permissions
- **Professeurs**:
  - Créer, modifier, supprimer des devoirs
  - Voir toutes les soumissions
  - Ajouter des commentaires
  - Attribuer des notes

- **Élèves**:
  - Voir tous les devoirs
  - Soumettre une copie par devoir
  - Voir leurs propres soumissions
  - Lire les commentaires des professeurs

### Interface Utilisateur
- Dashboard avec navigation par onglets
- Design moderne et responsive
- Indicateurs visuels (statuts, badges)
- Animations et transitions fluides
- Messages d'erreur clairs

## Sécurité

- Authentification JWT avec tokens sécurisés
- Validation des données côté serveur
- Protection CORS configurée
- Vérification des permissions pour chaque action
- Hachage des mots de passe avec bcrypt

## Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Scripts disponibles
```bash
# Développement
npm run dev              # Lancer backend + frontend
npm run server           # Lancer uniquement le backend
npm run client           # Lancer uniquement le frontend

# Installation
npm run install-all      # Installer toutes les dépendances
```

## Améliorations futures possibles

- Upload de fichiers pour les soumissions
- Système de classes/groupes
- Calendrier des devoirs
- Statistiques et tableaux de bord
- Export des notes en CSV/PDF
- Mode sombre
- Messagerie vocale/vidéo
- Application mobile

## Licence

MIT

## Auteur

ETSE ADJOVI

## Support

Pour toute question ou problème, veuillez créer une issue sur GitHub.
