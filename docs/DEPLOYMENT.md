# Guide de Déploiement

Ce guide explique comment déployer l'application SOUKLOU en production.

## Prérequis

- Node.js 18+ installé
- MongoDB 5+ installé ou accès à MongoDB Atlas
- Serveur avec au moins 2GB RAM
- Nom de domaine configuré (optionnel mais recommandé)

## Configuration de Production

### Variables d'Environnement

#### Backend

Créez un fichier `.env` dans le dossier `backend/` :

```env
NODE_ENV=production
PORT=5000

# Base de données
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/souklou?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre_secret_super_securise_genere_aleatoirement
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://votredomaine.com

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/uploads
```

#### Frontend

Créez un fichier `.env.production` dans le dossier `frontend/` :

```env
REACT_APP_API_URL=https://api.votredomaine.com/api
```

## Déploiement sur VPS

### 1. Préparation du Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer MongoDB (ou utiliser MongoDB Atlas)
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Installer Nginx
sudo apt install -y nginx

# Installer PM2
sudo npm install -g pm2
```

### 2. Déploiement du Backend

```bash
# Cloner le repository
git clone https://github.com/fanymodeste25/SOUKLOU.git
cd SOUKLOU/backend

# Installer les dépendances
npm install --production

# Configurer les variables d'environnement
nano .env

# Démarrer avec PM2
pm2 start src/server.js --name souklou-api
pm2 save
pm2 startup
```

### 3. Déploiement du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Build pour la production
npm run build

# Copier les fichiers dans le dossier de Nginx
sudo cp -r build/* /var/www/html/
```

### 4. Configuration de Nginx

#### Backend (API)

Créez `/etc/nginx/sites-available/souklou-api` :

```nginx
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Frontend

Créez `/etc/nginx/sites-available/souklou-frontend` :

```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activez les sites :

```bash
sudo ln -s /etc/nginx/sites-available/souklou-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/souklou-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir les certificats
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
sudo certbot --nginx -d api.votredomaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

## Déploiement sur Vercel (Frontend)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd frontend
vercel --prod
```

Configuration `vercel.json` :

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000, immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Déploiement sur Heroku (Backend)

```bash
# Installer Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Se connecter
heroku login

# Créer l'application
cd backend
heroku create souklou-api

# Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Déployer
git push heroku main
```

Créez un `Procfile` dans `backend/` :

```
web: node src/server.js
```

## Monitoring

### PM2 Monitoring

```bash
# Voir les logs
pm2 logs souklou-api

# Voir le statut
pm2 status

# Redémarrer
pm2 restart souklou-api
```

### Logs Nginx

```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

## Sauvegarde

### Base de données MongoDB

```bash
# Créer un backup
mongodump --uri="mongodb://localhost:27017/souklou" --out=/backup/$(date +%Y%m%d)

# Restaurer
mongorestore --uri="mongodb://localhost:27017/souklou" /backup/20250101
```

### Automatiser les backups (cron)

```bash
# Éditer crontab
crontab -e

# Ajouter une tâche quotidienne à 2h du matin
0 2 * * * mongodump --uri="mongodb://localhost:27017/souklou" --out=/backup/$(date +\%Y\%m\%d)
```

## Sécurité

### Firewall

```bash
# Autoriser SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Mises à jour

```bash
# Mise à jour des dépendances
npm audit
npm audit fix

# Mise à jour du système
sudo apt update && sudo apt upgrade -y
```

## Rollback

En cas de problème :

```bash
# Backend
pm2 stop souklou-api
git checkout previous-commit
npm install
pm2 restart souklou-api

# Frontend
git checkout previous-commit
npm run build
sudo cp -r build/* /var/www/html/
```

## Support

Pour toute question sur le déploiement, ouvrez une Issue sur GitHub.
