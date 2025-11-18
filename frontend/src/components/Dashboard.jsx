import { useState, useEffect } from 'react'
import { initSocket, disconnectSocket, getSocket } from '../services/socket'
import { api } from '../services/api'
import Chat from './Chat'
import AssignmentList from './AssignmentList'
import Notifications from './Notifications'

function Dashboard({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('chat')
  const [socket, setSocket] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Initialiser Socket.io
    const token = localStorage.getItem('token')
    const socketInstance = initSocket(token)
    setSocket(socketInstance)

    // Écouter les notifications
    socketInstance.on('new_notification', (notification) => {
      loadNotificationCount()
    })

    socketInstance.on('unread_notifications', (notifications) => {
      setNotificationCount(notifications.length)
    })

    // Charger le compteur de notifications
    loadNotificationCount()

    return () => {
      disconnectSocket()
    }
  }, [])

  const loadNotificationCount = async () => {
    const result = await api.getNotificationCount()
    if (result.count !== undefined) {
      setNotificationCount(result.count)
    }
  }

  const handleLogout = () => {
    disconnectSocket()
    onLogout()
  }

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="dashboard-header">
          <h2>🎓 SOUKLOU</h2>
          <div className="user-info">
            <p><strong>{user.prenom} {user.nom}</strong></p>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'eleve' ? 'Élève' : 'Professeur'}
            </span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className={`nav-item ${currentView === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentView('chat')}
          >
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </button>

          <button
            className={`nav-item ${currentView === 'assignments' ? 'active' : ''}`}
            onClick={() => setCurrentView('assignments')}
          >
            <span className="nav-icon">📚</span>
            <span>Devoirs</span>
          </button>

          <button
            className={`nav-item ${currentView === 'notifications' ? 'active' : ''}`}
            onClick={() => setCurrentView('notifications')}
          >
            <span className="nav-icon">🔔</span>
            <span>Notifications</span>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>
        </nav>

        <button className="logout-btn-dashboard" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        {currentView === 'chat' && <Chat user={user} socket={socket} />}
        {currentView === 'assignments' && <AssignmentList user={user} socket={socket} />}
        {currentView === 'notifications' && (
          <Notifications
            user={user}
            socket={socket}
            onNotificationCountChange={setNotificationCount}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
