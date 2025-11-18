# Architecture SOUKLOU

## Vue d'ensemble

SOUKLOU est une application marketplace full-stack construite avec une architecture moderne séparant le frontend et le backend.

## Stack Technique

### Frontend
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Data Fetching**: React Query

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB avec Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Logging**: Morgan

## Architecture Globale

```
┌─────────────────┐
│   Utilisateur   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Frontend │ (React + Vite)
    │  :3000   │
    └────┬────┘
         │ HTTP/REST
    ┌────▼────┐
    │ Backend  │ (Express + Node.js)
    │  :5000   │
    └────┬────┘
         │ Mongoose
    ┌────▼────┐
    │ MongoDB  │
    │  :27017  │
    └─────────┘
```

## Structure du Projet

### Backend

```
backend/
├── src/
│   ├── config/           # Configuration (DB, environnement)
│   │   └── database.js   # Configuration MongoDB
│   ├── controllers/      # Logique métier
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── models/           # Modèles Mongoose
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/           # Définition des routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── middlewares/      # Middlewares Express
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/            # Fonctions utilitaires
│   │   ├── token.js
│   │   └── upload.js
│   └── server.js         # Point d'entrée
├── tests/                # Tests unitaires et d'intégration
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/       # Composants React réutilisables
│   │   ├── common/       # Composants génériques
│   │   ├── layout/       # Layout (Header, Footer)
│   │   └── product/      # Composants produits
│   ├── pages/            # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   └── Profile.tsx
│   ├── services/         # Services API
│   │   ├── api.ts        # Configuration Axios
│   │   ├── authService.ts
│   │   └── productService.ts
│   ├── hooks/            # Custom React Hooks
│   │   ├── useAuth.ts
│   │   └── useProducts.ts
│   ├── context/          # Context API
│   │   └── AuthContext.tsx
│   ├── utils/            # Utilitaires
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── App.tsx           # Composant racine
│   ├── main.tsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── public/               # Assets statiques
└── package.json
```

## Flux de Données

### Authentification

```
1. User entre credentials → Frontend
2. Frontend → POST /api/auth/login → Backend
3. Backend vérifie credentials dans MongoDB
4. Backend génère JWT
5. Backend → JWT → Frontend
6. Frontend stocke JWT (localStorage/cookie)
7. Frontend inclut JWT dans headers pour requêtes protégées
```

### Gestion des Produits

```
1. User demande liste produits → Frontend
2. Frontend → GET /api/products → Backend
3. Backend query MongoDB
4. MongoDB → données → Backend
5. Backend → JSON response → Frontend
6. Frontend affiche avec React
```

## Modèles de Données

### User

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['buyer', 'seller', 'admin'],
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: Boolean,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: Enum,
  images: [{
    url: String,
    alt: String
  }],
  stock: Number,
  seller: ObjectId (ref: User),
  ratings: {
    average: Number,
    count: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API REST

### Endpoints Principaux

```
POST   /api/auth/register    # Inscription
POST   /api/auth/login       # Connexion
GET    /api/auth/me          # Profil utilisateur

GET    /api/products         # Liste produits
GET    /api/products/:id     # Détail produit
POST   /api/products         # Créer produit (vendeur)
PUT    /api/products/:id     # Modifier produit (vendeur)
DELETE /api/products/:id     # Supprimer produit (vendeur)

GET    /api/users/me         # Profil
PUT    /api/users/me         # Modifier profil
```

## Sécurité

### Mesures Implémentées

1. **Authentification**
   - JWT avec expiration
   - Passwords hashés avec bcrypt (10 rounds)
   - Tokens stockés de manière sécurisée

2. **Protection API**
   - Helmet.js pour headers HTTP sécurisés
   - CORS configuré
   - Rate limiting (100 req/15min)
   - Validation des inputs avec express-validator

3. **Base de données**
   - Mongoose schema validation
   - Indexes pour performance
   - Transactions pour opérations critiques

## Performance

### Optimisations

1. **Frontend**
   - Code splitting avec React.lazy
   - Memoization (useMemo, useCallback)
   - Image optimization
   - Caching avec React Query

2. **Backend**
   - Compression des responses
   - Indexes MongoDB
   - Pagination des résultats
   - Caching (à implémenter avec Redis)

3. **Database**
   - Indexes sur champs fréquents
   - Aggregation pipelines
   - Projection pour limiter les données

## Scalabilité

### Stratégies

1. **Horizontal Scaling**
   - Load balancer (Nginx)
   - Multiple instances backend (PM2 cluster)
   - Database replication

2. **Caching**
   - Redis pour sessions/cache
   - CDN pour assets statiques

3. **Microservices** (future)
   - Service produits
   - Service utilisateurs
   - Service paiements
   - Service notifications

## Tests

### Stratégie de Test

1. **Backend**
   - Unit tests: Jest
   - Integration tests: Supertest
   - Coverage minimum: 80%

2. **Frontend**
   - Unit tests: Vitest
   - Component tests: React Testing Library
   - E2E: (à implémenter avec Playwright)

## CI/CD

### Pipeline Recommandé

```
1. Commit → GitHub
2. Trigger GitHub Actions
3. Run linting (ESLint)
4. Run tests (Jest/Vitest)
5. Build application
6. Deploy to staging
7. Run E2E tests
8. Deploy to production (manual approval)
```

## Monitoring

### Outils Recommandés

- **Logs**: Winston + ELK Stack
- **Metrics**: Prometheus + Grafana
- **APM**: New Relic / DataDog
- **Error Tracking**: Sentry

## Environnements

### Development
- Frontend: localhost:3000
- Backend: localhost:5000
- MongoDB: localhost:27017

### Staging
- Frontend: staging.souklou.com
- Backend: api-staging.souklou.com
- MongoDB: MongoDB Atlas

### Production
- Frontend: souklou.com
- Backend: api.souklou.com
- MongoDB: MongoDB Atlas (production cluster)

## Évolutions Futures

1. **Phase 2**
   - Système de paiement (Stripe)
   - Chat en temps réel (Socket.io)
   - Notifications push

2. **Phase 3**
   - Application mobile (React Native)
   - Dashboard analytics
   - API GraphQL

3. **Phase 4**
   - IA pour recommandations
   - Multi-langue
   - Multi-devises
