#!/bin/bash

echo "=========================================="
echo "Démarrage de SOUKLOU"
echo "=========================================="
echo ""

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "❌ Environnement virtuel non trouvé. Exécutez ./install.sh d'abord."
    exit 1
fi

source venv/bin/activate

# Check if database exists
if [ ! -f "db.sqlite3" ]; then
    echo "❌ Base de données non trouvée. Exécutez ./install.sh d'abord."
    exit 1
fi

echo "🚀 Démarrage du serveur de développement..."
echo ""
echo "Le serveur sera accessible à : http://127.0.0.1:8000"
echo "Interface d'administration : http://127.0.0.1:8000/admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

python manage.py runserver
