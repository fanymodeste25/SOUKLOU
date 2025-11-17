import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const register = (req, res) => {
  try {
    const { username, email, password, role, nom, prenom } = req.body;

    // Validation
    if (!username || !email || !password || !role || !nom || !prenom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (!['eleve', 'professeur'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    // Vérifier si l'utilisateur existe déjà
    if (User.findByEmail(email)) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    if (User.findByUsername(username)) {
      return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris" });
    }

    // Créer l'utilisateur
    const user = User.create({ username, email, password, role, nom, prenom });
    const token = generateToken(user);

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = User.findByEmail(email);

    if (!user || !User.comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user);
    delete user.password;

    res.json({
      message: 'Connexion réussie',
      token,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

export const getProfile = (req, res) => {
  try {
    const user = User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
