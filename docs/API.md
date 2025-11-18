# Documentation API SOUKLOU

Cette documentation décrit les endpoints de l'API REST de SOUKLOU.

## Base URL

```
http://localhost:5000/api
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

Incluez le token dans le header de vos requêtes :
```
Authorization: Bearer <votre_token>
```

## Endpoints

### Santé de l'API

#### GET /api/health

Vérifier l'état de l'API.

**Réponse**
```json
{
  "status": "OK",
  "message": "SOUKLOU API is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Authentification

#### POST /api/auth/register

Créer un nouveau compte utilisateur.

**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"
}
```

**Réponse**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login

Se connecter à un compte existant.

**Body**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Produits

#### GET /api/products

Récupérer la liste des produits.

**Query Parameters**
- `page` (number, default: 1) - Page de pagination
- `limit` (number, default: 10) - Nombre d'éléments par page
- `category` (string) - Filtrer par catégorie
- `minPrice` (number) - Prix minimum
- `maxPrice` (number) - Prix maximum
- `search` (string) - Recherche textuelle

**Réponse**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

#### GET /api/products/:id

Récupérer un produit spécifique.

**Réponse**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Product Name",
    "description": "...",
    "price": 99.99,
    "category": "Electronics",
    "stock": 10,
    "seller": {...},
    "ratings": {
      "average": 4.5,
      "count": 42
    }
  }
}
```

#### POST /api/products

Créer un nouveau produit (vendeurs uniquement).

**Headers**
```
Authorization: Bearer <token>
```

**Body**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 10,
  "images": [
    {
      "url": "https://...",
      "alt": "Product image"
    }
  ]
}
```

#### PUT /api/products/:id

Mettre à jour un produit (vendeur propriétaire uniquement).

**Headers**
```
Authorization: Bearer <token>
```

**Body**
```json
{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 15
}
```

#### DELETE /api/products/:id

Supprimer un produit (vendeur propriétaire uniquement).

**Headers**
```
Authorization: Bearer <token>
```

### Utilisateurs

#### GET /api/users/me

Récupérer le profil de l'utilisateur connecté.

**Headers**
```
Authorization: Bearer <token>
```

**Réponse**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "address": {...}
  }
}
```

#### PUT /api/users/me

Mettre à jour le profil de l'utilisateur.

**Headers**
```
Authorization: Bearer <token>
```

**Body**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "country": "Country"
  }
}
```

## Codes d'Erreur

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Format des Erreurs

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

## Rate Limiting

L'API est limitée à 100 requêtes par fenêtre de 15 minutes.

## Pagination

Les endpoints de liste supportent la pagination :

```
GET /api/products?page=2&limit=20
```

Réponse :
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```
