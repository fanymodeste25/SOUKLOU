# Guide de Contribution

Merci de votre intérêt pour contribuer à SOUKLOU ! Ce document fournit des directives pour contribuer au projet.

## Code de Conduite

En participant à ce projet, vous vous engagez à respecter notre code de conduite :
- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Faites preuve d'empathie envers les autres membres

## Comment Contribuer

### Signaler des Bugs

Si vous trouvez un bug :
1. Vérifiez d'abord si le bug n'a pas déjà été signalé dans les Issues
2. Si non, créez une nouvelle Issue avec :
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Des captures d'écran si pertinent
   - Votre environnement (OS, version de Node.js, etc.)

### Proposer des Améliorations

Pour proposer une nouvelle fonctionnalité :
1. Créez une Issue décrivant :
   - La fonctionnalité proposée
   - Pourquoi elle serait utile
   - Comment elle pourrait fonctionner
2. Attendez les retours avant de commencer le développement

### Processus de Pull Request

1. **Fork le repository** et créez votre branche depuis `main`
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Installez les dépendances**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Faites vos modifications**
   - Suivez les conventions de code du projet
   - Ajoutez des tests si nécessaire
   - Mettez à jour la documentation

4. **Testez vos modifications**
   ```bash
   # Backend
   npm test
   npm run lint

   # Frontend
   npm test
   npm run lint
   ```

5. **Commitez vos changements**
   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   ```

6. **Pushez vers votre fork**
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

7. **Créez une Pull Request**
   - Donnez un titre clair
   - Décrivez vos changements en détail
   - Référencez les Issues liées

## Conventions de Code

### JavaScript/TypeScript

- Utilisez ESLint et Prettier (configs fournies)
- Indentation : 2 espaces
- Guillemets simples pour les strings
- Point-virgules obligatoires
- Nommage :
  - camelCase pour les variables et fonctions
  - PascalCase pour les composants React et classes
  - UPPER_CASE pour les constantes

### Commits

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants, etc.
- `refactor:` refactorisation du code
- `test:` ajout ou modification de tests
- `chore:` tâches de maintenance

Exemples :
```
feat: ajouter système de panier
fix: corriger bug de validation email
docs: mettre à jour le README
```

### Structure des Fichiers

#### Backend
```
src/
├── config/       # Configuration (DB, env)
├── controllers/  # Logique métier
├── models/       # Modèles de données
├── routes/       # Définition des routes
├── middlewares/  # Middlewares Express
├── utils/        # Fonctions utilitaires
└── server.js     # Point d'entrée
```

#### Frontend
```
src/
├── components/   # Composants réutilisables
├── pages/        # Pages de l'application
├── services/     # Services API
├── hooks/        # Custom hooks React
├── context/      # Context API
├── utils/        # Fonctions utilitaires
└── App.tsx       # Composant racine
```

## Tests

- Écrivez des tests pour toute nouvelle fonctionnalité
- Assurez-vous que tous les tests passent avant de soumettre une PR
- Visez une couverture de code d'au moins 80%

### Backend (Jest)
```bash
npm test                 # Lancer les tests
npm test -- --watch     # Mode watch
npm test -- --coverage  # Avec couverture
```

### Frontend (Vitest)
```bash
npm test              # Lancer les tests
npm run test:ui       # Interface UI
```

## Style Guide

### React/TypeScript

```tsx
// Bon
interface ProductProps {
  id: string;
  name: string;
  price: number;
}

const Product: React.FC<ProductProps> = ({ id, name, price }) => {
  return (
    <div className="product">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
};

export default Product;
```

### Node.js/Express

```javascript
// Bon
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts };
```

## Documentation

- Commentez le code complexe
- Utilisez JSDoc pour les fonctions publiques
- Mettez à jour le README si nécessaire
- Ajoutez des exemples d'utilisation

## Questions ?

N'hésitez pas à :
- Ouvrir une Issue pour poser des questions
- Contacter les mainteneurs du projet

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

Merci pour votre contribution ! 🙏
