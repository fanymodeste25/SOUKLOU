# SOUKLOU

Une plateforme moderne de marketplace pour connecter vendeurs et acheteurs.

## 📋 Description

SOUKLOU est une application de marketplace e-commerce conçue pour faciliter les transactions entre vendeurs et acheteurs. La plateforme offre une expérience utilisateur moderne et intuitive.

## ✨ Fonctionnalités

- 🛍️ Catalogue de produits dynamique
- 👥 Gestion des comptes utilisateurs (vendeurs et acheteurs)
- 🛒 Panier d'achat et gestion des commandes
- 💳 Intégration de paiement sécurisé
- ⭐ Système de notation et d'avis
- 🔍 Recherche et filtrage avancés
- 📱 Interface responsive (mobile-first)
- 🔐 Authentification et autorisation sécurisées

## 🚀 Technologies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT pour l'authentification
- Bcrypt pour le hashage de mots de passe

## 📦 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- MongoDB (v5 ou supérieur)

### Étapes d'installation

1. Cloner le repository
```bash
git clone https://github.com/fanymodeste25/SOUKLOU.git
cd SOUKLOU
```

2. Installer les dépendances du backend
```bash
cd backend
npm install
```

3. Installer les dépendances du frontend
```bash
cd ../frontend
npm install
```

4. Configurer les variables d'environnement

Backend (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/souklou
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Démarrer le serveur de développement

Backend:
```bash
cd backend
npm run dev
```

Frontend (dans un nouveau terminal):
```bash
cd frontend
npm start
```

## 🏗️ Structure du projet

```
SOUKLOU/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, env)
│   │   ├── controllers/     # Contrôleurs
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── middlewares/     # Middlewares
│   │   ├── utils/           # Utilitaires
│   │   └── server.js        # Point d'entrée
│   ├── tests/               # Tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages
│   │   ├── services/        # Services API
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API
│   │   ├── utils/           # Utilitaires
│   │   └── App.tsx          # Composant principal
│   ├── public/              # Fichiers statiques
│   └── package.json
├── docs/                    # Documentation
├── .gitignore
├── LICENSE
└── README.md
```

## 🧪 Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Scripts disponibles

### Backend
- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en mode développement
- `npm test` - Lancer les tests
- `npm run lint` - Vérifier le code avec ESLint

### Frontend
- `npm start` - Démarrer l'application en développement
- `npm run build` - Build pour la production
- `npm test` - Lancer les tests
- `npm run lint` - Vérifier le code avec ESLint

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**ETSE ADJOVI**

## 🙏 Remerciements

- Tous les contributeurs qui participent à ce projet
- La communauté open source pour les outils et bibliothèques utilisés

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

Fait avec ❤️ par ETSE ADJOVI
