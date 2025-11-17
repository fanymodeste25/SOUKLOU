# SOUKLOU - Plateforme d'apprentissage

SOUKLOU est une plateforme d'apprentissage moderne où les enseignants publient des fiches résumées et les élèves passent des QCM pour valider leurs connaissances.

## Fonctionnalités

### Pour les Élèves
- 📚 Consulter les fiches de cours résumées
- ✅ Passer des QCM interactifs
- 📊 Suivre ses résultats et sa progression
- 🎯 Voir les corrections détaillées

### Pour les Enseignants
- ✏️ Créer et gérer des fiches de cours
- ❓ Ajouter des questions et réponses (QCM)
- 📈 Suivre la performance des élèves
- 📊 Analyser les statistiques par fiche

## Technologies utilisées

- **Backend** : Django 5.2
- **Frontend** : HTML, Tailwind CSS (via CDN)
- **Base de données** : SQLite (développement) / PostgreSQL (production)
- **Authentification** : Django Auth avec modèle utilisateur personnalisé

## Installation

### Prérequis
- Python 3.8 ou supérieur
- pip
- virtualenv (recommandé)

### Installation automatique

```bash
chmod +x install.sh
./install.sh
```

### Installation manuelle

1. **Cloner le repository**
```bash
git clone <votre-repo>
cd SOUKLOU
```

2. **Créer un environnement virtuel**
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

5. **Appliquer les migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

7. **Collecter les fichiers statiques**
```bash
python manage.py collectstatic
```

8. **Lancer le serveur de développement**
```bash
python manage.py runserver
```

L'application sera accessible à : http://127.0.0.1:8000

## Structure du projet

```
SOUKLOU/
├── accounts/           # Gestion des utilisateurs (élèves/enseignants)
├── fiches/            # Gestion des fiches de cours
├── quizzes/           # Gestion des questions et quiz
├── results/           # Gestion des résultats et tentatives
├── templates/         # Templates HTML
│   ├── accounts/
│   ├── fiches/
│   ├── quizzes/
│   └── results/
├── static/            # Fichiers statiques (CSS, JS, images)
├── media/             # Fichiers uploadés par les utilisateurs
├── souklou_project/   # Configuration du projet Django
├── manage.py
├── requirements.txt
└── README.md
```

## Utilisation

### Premier lancement

1. Créez un compte enseignant via l'interface d'inscription
2. Créez votre première fiche de cours
3. Ajoutez des questions avec leurs réponses
4. Les élèves peuvent maintenant s'inscrire et passer les quiz

### Interface d'administration

Accédez à l'interface d'administration Django à : http://127.0.0.1:8000/admin

Utilisez les identifiants du superutilisateur créé lors de l'installation.

## Modèles de données

### User (Utilisateur)
- Hérite de AbstractUser
- Champs additionnels : role (student/teacher), phone, avatar, bio

### Fiche
- Titre, description, contenu
- Catégorie, niveau de difficulté
- Auteur (enseignant)
- Nombre de vues

### Question
- Liée à une fiche
- Texte de la question
- Ordre d'affichage
- Points attribués

### Answer (Réponse)
- Liée à une question
- Texte de la réponse
- Boolean is_correct

### QuizAttempt (Tentative)
- Élève, fiche
- Score, nombre de questions
- Réponses correctes
- Temps passé
- Date de completion

### QuestionAnswer
- Tentative, question
- Réponse sélectionnée
- Boolean is_correct

## Configuration de production

### Variables d'environnement importantes

```env
SECRET_KEY=votre-clé-secrète-très-longue
DEBUG=False
ALLOWED_HOSTS=votredomaine.com,www.votredomaine.com
DATABASE_URL=postgres://user:password@localhost/dbname
```

### Serveur de production

Pour déployer en production avec Gunicorn :

```bash
pip install gunicorn
gunicorn souklou_project.wsgi:application --bind 0.0.0.0:8000
```

### Base de données PostgreSQL

1. Installez PostgreSQL
2. Créez une base de données
3. Mettez à jour DATABASE_URL dans .env
4. Installez psycopg2 : `pip install psycopg2-binary`

## Fonctionnalités avancées (futures)

- [ ] Export PDF des fiches
- [ ] Mode révision avec répétition espacée
- [ ] Intelligence adaptative (questions selon niveau)
- [ ] Classement des élèves
- [ ] Notifications par email
- [ ] API REST pour application mobile
- [ ] Support multilingue
- [ ] Thème sombre
- [ ] Gamification avec badges

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Sécurité

- Mots de passe hashés avec PBKDF2
- Protection CSRF activée
- Protection XSS via les templates Django
- Validation des entrées utilisateur
- Séparation des rôles (élève/enseignant)

## Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Envoyez un email à support@souklou.com

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Auteurs

Développé avec ❤️ pour faciliter l'apprentissage.

---

**SOUKLOU** - *Résumez, Apprenez, Réussissez*
