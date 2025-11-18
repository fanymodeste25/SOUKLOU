import { useState } from 'react'
import { api } from '../services/api'

function CreateAssignment({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.createAssignment(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch (err) {
      setError('Erreur lors de la création du devoir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-assignment-form">
      <h2>Créer un nouveau devoir</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre du devoir</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: Dissertation sur la révolution française"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Décrivez les consignes du devoir..."
          />
        </div>

        <div className="form-group">
          <label>Date limite (optionnelle)</label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Création...' : 'Créer le devoir'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignment
