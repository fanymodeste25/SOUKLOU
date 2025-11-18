import { useState, useEffect } from 'react'
import { api } from '../services/api'

function Notifications({ user, socket, onNotificationCountChange }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()

    if (socket) {
      socket.on('new_notification', handleNewNotification)
    }

    return () => {
      if (socket) {
        socket.off('new_notification', handleNewNotification)
      }
    }
  }, [socket])

  const loadNotifications = async () => {
    setLoading(true)
    const result = await api.getNotifications()
    if (result.notifications) {
      setNotifications(result.notifications)
      const unreadCount = result.notifications.filter(n => !n.read_status).length
      onNotificationCountChange(unreadCount)
    }
    setLoading(false)
  }

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    onNotificationCountChange(prev => prev + 1)
  }

  const handleMarkAsRead = async (notificationId) => {
    await api.markNotificationAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read_status: 1 } : n
      )
    )
    onNotificationCountChange(prev => Math.max(0, prev - 1))

    if (socket) {
      socket.emit('mark_notification_read', { notificationId })
    }
  }

  const handleMarkAllAsRead = async () => {
    await api.markAllNotificationsAsRead()
    setNotifications(prev =>
      prev.map(n => ({ ...n, read_status: 1 }))
    )
    onNotificationCountChange(0)

    if (socket) {
      socket.emit('mark_all_notifications_read')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'À l\'instant'
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`
    if (diff < 604800000) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'nouveau_devoir':
        return '📚'
      case 'nouvelle_soumission':
        return '📝'
      case 'nouveau_commentaire':
        return '💬'
      case 'new_message':
        return '✉️'
      default:
        return '🔔'
    }
  }

  return (
    <div className="notifications-view">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notifications.some(n => !n.read_status) && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Chargement des notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <h3>🔔 Aucune notification</h3>
          <p>Vous êtes à jour !</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read_status ? 'unread' : ''}`}
              onClick={() => !notification.read_status && handleMarkAsRead(notification.id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{formatDate(notification.created_at)}</span>
              </div>
              {!notification.read_status && (
                <span className="unread-indicator"></span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
