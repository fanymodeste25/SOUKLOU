#!/bin/bash

echo "=========================================="
echo "Installation de SOUKLOU"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez installer Python 3.8 ou supérieur."
    exit 1
fi

echo "✓ Python 3 détecté"

# Create virtual environment
echo "📦 Création de l'environnement virtuel..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activation de l'environnement virtuel..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Mise à jour de pip..."
pip install --upgrade pip -q

# Install dependencies
echo "📚 Installation des dépendances..."
pip install -r requirements.txt -q

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  N'oubliez pas de configurer votre fichier .env !"
fi

# Create static and media directories
echo "📁 Création des répertoires nécessaires..."
mkdir -p static staticfiles media media/avatars

# Run migrations
echo "🔄 Application des migrations de base de données..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo ""
echo "=========================================="
echo "Création d'un compte administrateur"
echo "=========================================="
python manage.py createsuperuser

# Collect static files
echo ""
echo "📦 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo ""
echo "=========================================="
echo "✅ Installation terminée avec succès !"
echo "=========================================="
echo ""
echo "Pour démarrer le serveur de développement :"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Puis ouvrez votre navigateur à : http://127.0.0.1:8000"
echo ""
echo "Pour accéder à l'interface d'administration : http://127.0.0.1:8000/admin"
echo ""
