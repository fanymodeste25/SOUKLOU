import { useState, useEffect } from 'react'
import { api } from '../services/api'
import AssignmentDetail from './AssignmentDetail'
import CreateAssignment from './CreateAssignment'

function AssignmentList({ user, socket }) {
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setLoading(true)
    const result = await api.getAssignments()
    if (result.assignments) {
      setAssignments(result.assignments)
    }
    setLoading(false)
  }

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment)
    setShowCreateForm(false)
  }

  const handleCreateNew = () => {
    setShowCreateForm(true)
    setSelectedAssignment(null)
  }

  const handleAssignmentCreated = () => {
    setShowCreateForm(false)
    loadAssignments()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Pas de date limite'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="assignments-view">
      <div className="assignments-sidebar">
        {user.role === 'professeur' && (
          <button className="create-assignment-btn" onClick={handleCreateNew}>
            + Créer un devoir
          </button>
        )}

        <div className="assignments-list">
          <h3>Liste des devoirs</h3>
          {loading ? (
            <p className="loading-text">Chargement...</p>
          ) : assignments.length === 0 ? (
            <p className="empty-message">Aucun devoir disponible</p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`assignment-item ${
                  selectedAssignment?.id === assignment.id ? 'active' : ''
                }`}
                onClick={() => handleSelectAssignment(assignment)}
              >
                <h4>{assignment.title}</h4>
                <p className="assignment-meta">
                  {user.role === 'eleve' && (
                    <span>Par {assignment.teacher_prenom} {assignment.teacher_nom}</span>
                  )}
                  {user.role === 'professeur' && assignment.submission_count && (
                    <span>{assignment.submission_count} copies</span>
                  )}
                </p>
                <p className="assignment-date">{formatDate(assignment.due_date)}</p>
                {user.role === 'eleve' && assignment.submission_status && (
                  <span className={`status-badge ${assignment.submission_status}`}>
                    {assignment.submission_status === 'corrige' ? 'Corrigé' : 'Soumis'}
                  </span>
                )}
                {user.role === 'eleve' && !assignment.submission_id && (
                  <span className="status-badge non-soumis">Non soumis</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="assignments-main">
        {showCreateForm ? (
          <CreateAssignment
            onSuccess={handleAssignmentCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : selectedAssignment ? (
          <AssignmentDetail
            assignment={selectedAssignment}
            user={user}
            socket={socket}
            onUpdate={loadAssignments}
          />
        ) : (
          <div className="assignments-empty">
            <h3>📚 Gestion des devoirs</h3>
            <p>
              {user.role === 'professeur'
                ? 'Créez un nouveau devoir ou sélectionnez-en un existant'
                : 'Sélectionnez un devoir pour voir les détails'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentList
