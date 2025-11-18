import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createAssignment = (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Titre et description requis' });
    }

    // Vérifier que l'utilisateur est un professeur
    if (req.userRole !== 'professeur') {
      return res.status(403).json({ error: 'Seuls les professeurs peuvent créer des devoirs' });
    }

    const assignment = Assignment.create({
      teacherId: req.userId,
      title,
      description,
      dueDate
    });

    // Notifier tous les élèves
    const students = User.getAllByRole('eleve');
    students.forEach(student => {
      Notification.create({
        userId: student.id,
        type: 'nouveau_devoir',
        title: 'Nouveau devoir disponible',
        message: `Le professeur a publié un nouveau devoir : ${title}`,
        link: `/assignments/${assignment.id}`
      });
    });

    res.status(201).json({ assignment });
  } catch (error) {
    console.error('Erreur lors de la création du devoir:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAllAssignments = (req, res) => {
  try {
    let assignments;

    if (req.userRole === 'eleve') {
      // Pour les élèves, inclure le statut de soumission
      assignments = Assignment.getWithSubmissionStatus(req.userId);
    } else {
      // Pour les professeurs, obtenir tous les devoirs
      assignments = Assignment.getAll();
    }

    res.json({ assignments });
  } catch (error) {
    console.error('Erreur lors de la récupération des devoirs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAssignmentById = (req, res) => {
  try {
    const { id } = req.params;
    const assignment = Assignment.findById(parseInt(id));

    if (!assignment) {
      return res.status(404).json({ error: 'Devoir non trouvé' });
    }

    res.json({ assignment });
  } catch (error) {
    console.error('Erreur lors de la récupération du devoir:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getTeacherAssignments = (req, res) => {
  try {
    if (req.userRole !== 'professeur') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const assignments = Assignment.getByTeacherId(req.userId);
    res.json({ assignments });
  } catch (error) {
    console.error('Erreur lors de la récupération des devoirs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateAssignment = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    const assignment = Assignment.findById(parseInt(id));

    if (!assignment) {
      return res.status(404).json({ error: 'Devoir non trouvé' });
    }

    // Vérifier que c'est le professeur qui a créé le devoir
    if (assignment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const updatedAssignment = Assignment.update(parseInt(id), {
      title,
      description,
      dueDate
    });

    res.json({ assignment: updatedAssignment });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devoir:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteAssignment = (req, res) => {
  try {
    const { id } = req.params;
    const assignment = Assignment.findById(parseInt(id));

    if (!assignment) {
      return res.status(404).json({ error: 'Devoir non trouvé' });
    }

    // Vérifier que c'est le professeur qui a créé le devoir
    if (assignment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    Assignment.delete(parseInt(id));
    res.json({ message: 'Devoir supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du devoir:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
