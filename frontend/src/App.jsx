import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="app-container">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🎓 SOUKLOU</h1>
          <p>Plateforme de chat entre élèves et professeurs</p>
        </div>

        {showRegister ? (
          <>
            <Register onSuccess={handleLoginSuccess} />
            <p className="auth-switch">
              Déjà inscrit ?{' '}
              <button onClick={() => setShowRegister(false)}>Se connecter</button>
            </p>
          </>
        ) : (
          <>
            <Login onSuccess={handleLoginSuccess} />
            <p className="auth-switch">
              Pas encore de compte ?{' '}
              <button onClick={() => setShowRegister(true)}>S'inscrire</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
