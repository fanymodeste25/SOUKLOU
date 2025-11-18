import Comment from '../models/Comment.js';
import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Notification from '../models/Notification.js';

export const createComment = (req, res) => {
  try {
    const { submissionId, content } = req.body;

    if (!submissionId || !content) {
      return res.status(400).json({ error: 'ID de soumission et contenu requis' });
    }

    // Vérifier que l'utilisateur est un professeur
    if (req.userRole !== 'professeur') {
      return res.status(403).json({ error: 'Seuls les professeurs peuvent commenter' });
    }

    // Vérifier que la soumission existe
    const submission = Submission.findById(parseInt(submissionId));
    if (!submission) {
      return res.status(404).json({ error: 'Soumission non trouvée' });
    }

    // Vérifier que c'est le bon professeur
    const assignment = Assignment.findById(submission.assignment_id);
    if (assignment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const comment = Comment.create({
      submissionId: parseInt(submissionId),
      teacherId: req.userId,
      content
    });

    // Notifier l'élève
    Notification.create({
      userId: submission.student_id,
      type: 'nouveau_commentaire',
      title: 'Nouveau commentaire sur votre copie',
      message: `Le professeur a commenté votre devoir : ${submission.assignment_title}`,
      link: `/submissions/${submissionId}`
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getCommentsBySubmission = (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = Submission.findById(parseInt(submissionId));
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

    const comments = Comment.getBySubmissionId(parseInt(submissionId));
    res.json({ comments });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updateComment = (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = Comment.findById(parseInt(id));
    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier que c'est le professeur qui a créé le commentaire
    if (comment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const updatedComment = Comment.update(parseInt(id), content);
    res.json({ comment: updatedComment });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteComment = (req, res) => {
  try {
    const { id } = req.params;
    const comment = Comment.findById(parseInt(id));

    if (!comment) {
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }

    // Vérifier que c'est le professeur qui a créé le commentaire
    if (comment.teacher_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    Comment.delete(parseInt(id));
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
