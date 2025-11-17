import User from '../models/User.js';

export const getAllUsers = (req, res) => {
  try {
    const users = User.getAll();
    res.json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUsersByRole = (req, res) => {
  try {
    const { role } = req.params;

    if (!['eleve', 'professeur'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    const users = User.getAllByRole(role);
    res.json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
