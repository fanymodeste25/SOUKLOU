import { useState, useEffect } from 'react'
import { api } from '../services/api'

function AssignmentDetail({ assignment, user, socket, onUpdate }) {
  const [submissions, setSubmissions] = useState([])
  const [mySubmission, setMySubmission] = useState(null)
  const [comments, setComments] = useState([])
  const [submissionContent, setSubmissionContent] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user.role === 'professeur') {
      loadSubmissions()
    } else {
      checkMySubmission()
    }
  }, [assignment.id])

  useEffect(() => {
    if (selectedSubmission) {
      loadComments(selectedSubmission.id)
    }
  }, [selectedSubmission])

  const loadSubmissions = async () => {
    const result = await api.getSubmissionsByAssignment(assignment.id)
    if (result.submissions) {
      setSubmissions(result.submissions)
    }
  }

  const checkMySubmission = async () => {
    const result = await api.getStudentSubmissions()
    if (result.submissions) {
      const submission = result.submissions.find(s => s.assignment_id === assignment.id)
      if (submission) {
        setMySubmission(submission)
        setSelectedSubmission(submission)
        loadComments(submission.id)
      }
    }
  }

  const loadComments = async (submissionId) => {
    const result = await api.getCommentsBySubmission(submissionId)
    if (result.comments) {
      setComments(result.comments)
    }
  }

  const handleSubmitAssignment = async (e) => {
    e.preventDefault()
    if (!submissionContent.trim()) return

    setLoading(true)
    const result = await api.createSubmission({
      assignmentId: assignment.id,
      content: submissionContent
    })

    if (result.submission) {
      setMySubmission(result.submission)
      setSelectedSubmission(result.submission)
      setSubmissionContent('')
      onUpdate()
    }
    setLoading(false)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentContent.trim() || !selectedSubmission) return

    setLoading(true)
    const result = await api.createComment({
      submissionId: selectedSubmission.id,
      content: commentContent
    })

    if (result.comment) {
      setComments([...comments, result.comment])
      setCommentContent('')
    }
    setLoading(false)
  }

  const handleGradeSubmission = async (submissionId, grade) => {
    await api.updateSubmission(submissionId, { grade })
    loadSubmissions()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="assignment-detail">
      <div className="assignment-header">
        <h2>{assignment.title}</h2>
        {assignment.due_date && (
          <p className="due-date">Date limite: {formatDate(assignment.due_date)}</p>
        )}
      </div>

      <div className="assignment-description">
        <h3>Consignes</h3>
        <p>{assignment.description}</p>
      </div>

      {user.role === 'eleve' && (
        <div className="student-submission-section">
          {!mySubmission ? (
            <form onSubmit={handleSubmitAssignment} className="submission-form">
              <h3>Soumettre votre devoir</h3>
              <textarea
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                rows="10"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Envoi...' : 'Soumettre le devoir'}
              </button>
            </form>
          ) : (
            <div className="my-submission">
              <h3>Votre soumission</h3>
              <div className="submission-content">
                <p><strong>Soumis le:</strong> {formatDate(mySubmission.submitted_at)}</p>
                <p><strong>Statut:</strong> {mySubmission.status === 'corrige' ? 'Corrigé' : 'En attente'}</p>
                {mySubmission.grade && (
                  <p><strong>Note:</strong> {mySubmission.grade}</p>
                )}
                <div className="submission-text">
                  <h4>Votre réponse:</h4>
                  <p>{mySubmission.content}</p>
                </div>
              </div>

              {comments.length > 0 && (
                <div className="comments-section">
                  <h4>Commentaires du professeur</h4>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p className="comment-author">
                        {comment.teacher_prenom} {comment.teacher_nom} - {formatDate(comment.created_at)}
                      </p>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {user.role === 'professeur' && (
        <div className="teacher-submissions-section">
          <h3>Copies soumises ({submissions.length})</h3>

          {submissions.length === 0 ? (
            <p className="empty-message">Aucune copie soumise pour le moment</p>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`submission-card ${selectedSubmission?.id === submission.id ? 'active' : ''}`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <h4>{submission.student_prenom} {submission.student_nom}</h4>
                  <p>Soumis le: {formatDate(submission.submitted_at)}</p>
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status === 'corrige' ? 'Corrigé' : 'À corriger'}
                  </span>
                  {submission.grade && <p className="grade">Note: {submission.grade}</p>}
                </div>
              ))}
            </div>
          )}

          {selectedSubmission && (
            <div className="submission-detail">
              <h3>Copie de {selectedSubmission.student_prenom} {selectedSubmission.student_nom}</h3>
              <div className="submission-content-box">
                <p>{selectedSubmission.content}</p>
              </div>

              {comments.length > 0 && (
                <div className="comments-section">
                  <h4>Vos commentaires</h4>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <p className="comment-meta">{formatDate(comment.created_at)}</p>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddComment} className="comment-form">
                <h4>Ajouter un commentaire</h4>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Votre commentaire sur cette copie..."
                  rows="4"
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Envoi...' : 'Ajouter le commentaire'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AssignmentDetail
