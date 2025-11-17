import { useState } from 'react'
import { api } from '../services/api'

function Register({ onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'eleve',
    nom: '',
    prenom: ''
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
      const result = await api.register(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess(result.user, result.token)
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Inscription</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            placeholder="Jean"
          />
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="jeandupont"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="votre@email.com"
        />
      </div>

      <div className="form-group">
        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
          placeholder="••••••••"
        />
      </div>

      <div className="form-group">
        <label>Rôle</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="eleve">Élève</option>
          <option value="professeur">Professeur</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </button>
    </form>
  )
}

export default Register
