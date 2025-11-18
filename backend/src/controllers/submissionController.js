import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';

export const createSubmission = (req, res) => {
  try {
    const { assignmentId, content, fileUrl } = req.body;

    if (!assignmentId || !content) {
      return res.status(400).json({ error: 'ID du devoir et contenu requis' });
    }

    // Vérifier que l'utilisateur est un élève
    if (req.userRole !== 'eleve') {
      return res.status(403).json({ error: 'Seuls les élèves peuvent soumettre des devoirs' });
    }

    // Vérifier que le devoir existe
    const assignment = Assignment.findById(parseInt(assignmentId));
    if (!assignment) {
      return res.status(404).json({ error: 'Devoir non trouvé' });
    }

    // Vérifier si l'élève n'a pas déjà soumis
    const existingSubmission = Submission.findByAssignmentAndStudent(
      parseInt(assignmentId),
      req.userId
    );

    if (existingSubmission) {
      return res.status(400).json({ error: 'Vous avez déjà soumis ce devoir' });
    }

    const submission = Submission.create({
      assignmentId: parseInt(assignmentId),
      studentId: req.userId,
      content,
      fileUrl
    });

    // Notifier le professeur
    Notification.create({
      userId: assignment.teacher_id,
      type: 'nouvelle_soumission',
      title: 'Nouvelle copie soumise',
      message: `Un élève a soumis le devoir : ${assignment.title}`,
      link: `/submissions/${submission.id}`
    });

    res.status(201).json({ submission });
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getSubmissionById = (req, res) => {
  try {
    const { id } = req.params;
    const submission = Submission.findById(parseInt(id));

    if (!submission) {
      return res.status(404).json({ error: 'Soumission non trouvée' });
    }

    // Vérifier l'accès
    const assignment = Assignment.findById(submission.assignment_id);
    if (
      req.userRole === 'eleve' && submission.student_id !== req.userId ||
      req.userRole === 'professeur' && assignment.teacher_id !== req.userId
    ) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Erreur lors de la récupération de la soumission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getSubmissionsByAssignment = (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Vérifier que le devoir existe
    const assignment = Assignment.findById(parseInt(assignmentId));
    if (!assignment) {
      return res.status(404).json({ error: 'Devoir non trouvé' });
    }

    // Vérifier l'accès (seul le professeur peut voir toutes les soumissions)
    if (req.userRole !== 'professeur' || assignment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const submissions = Submission.getByAssignmentId(parseInt(assignmentId));
    res.json({ submissions });
  } catch (error) {
    console.error('Erreur lors de la récupération des soumissions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getStudentSubmissions = (req, res) => {
  try {
    if (req.userRole !== 'eleve') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const submissions = Submission.getByStudentId(req.userId);
    res.json({ submissions });
  } catch (error) {
    console.error('Erreur lors de la récupération des soumissions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const { content, fileUrl, grade } = req.body;

    const submission = Submission.findById(parseInt(id));

    if (!submission) {
      return res.status(404).json({ error: 'Soumission non trouvée' });
    }

    // Vérifier l'accès
    if (req.userRole === 'eleve') {
      if (submission.student_id !== req.userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
      // Les élèves ne peuvent modifier que le contenu
      const updated = Submission.update(parseInt(id), { content, fileUrl });
      return res.json({ submission: updated });
    } else if (req.userRole === 'professeur') {
      const assignment = Assignment.findById(submission.assignment_id);
      if (assignment.teacher_id !== req.userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
      // Les professeurs peuvent modifier la note
      const updated = Submission.update(parseInt(id), { grade, status: 'corrige' });
      return res.json({ submission: updated });
    }

    res.status(403).json({ error: 'Accès non autorisé' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la soumission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteSubmission = (req, res) => {
  try {
    const { id } = req.params;
    const submission = Submission.findById(parseInt(id));

    if (!submission) {
      return res.status(404).json({ error: 'Soumission non trouvée' });
    }

    // Seul l'élève peut supprimer sa soumission
    if (submission.student_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    Submission.delete(parseInt(id));
    res.json({ message: 'Soumission supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la soumission:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
