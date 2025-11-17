import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { initSocket, disconnectSocket, getSocket } from '../services/socket'
import UserList from './UserList'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

function Chat({ user, onLogout }) {
  const [conversations, setConversations] = useState([])
  const [users, setUsers] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Initialiser Socket.io
    const token = localStorage.getItem('token')
    const socketInstance = initSocket(token)
    setSocket(socketInstance)

    // Écouter les événements socket
    socketInstance.on('new_message', (message) => {
      // Rafraîchir les conversations pour mettre à jour le dernier message
      loadConversations()
    })

    socketInstance.on('notification', (data) => {
      // Notification de nouveau message
      loadConversations()
    })

    // Charger les données initiales
    loadConversations()
    loadUsers()

    return () => {
      disconnectSocket()
    }
  }, [])

  const loadConversations = async () => {
    const result = await api.getConversations()
    if (result.conversations) {
      setConversations(result.conversations)
    }
  }

  const loadUsers = async () => {
    // Charger les utilisateurs du rôle opposé
    const targetRole = user.role === 'eleve' ? 'professeur' : 'eleve'
    const result = await api.getUsersByRole(targetRole)
    if (result.users) {
      setUsers(result.users)
    }
  }

  const handleStartConversation = async (userId) => {
    const result = await api.createConversation(userId)
    if (result.conversation) {
      await loadConversations()
      setSelectedConversation(result.conversation)
      setShowUserList(false)

      // Rejoindre la conversation via socket
      if (socket) {
        socket.emit('join_conversation', { conversationId: result.conversation.id })
      }
    }
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation)
    setShowUserList(false)

    // Rejoindre la conversation via socket
    if (socket) {
      socket.emit('join_conversation', { conversationId: conversation.id })
    }
  }

  const handleNewConversation = () => {
    setShowUserList(true)
    setSelectedConversation(null)
  }

  const handleLogout = () => {
    disconnectSocket()
    onLogout()
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <div className="user-info">
            <h3>{user.prenom} {user.nom}</h3>
            <span className={`role-badge ${user.role}`}>
              {user.role === 'eleve' ? 'Élève' : 'Professeur'}
            </span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>

        <button className="new-conversation-btn" onClick={handleNewConversation}>
          + Nouvelle conversation
        </button>

        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className="chat-main">
        {showUserList ? (
          <UserList
            users={users}
            userRole={user.role}
            onSelectUser={handleStartConversation}
          />
        ) : selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={user}
            socket={socket}
            onConversationUpdate={loadConversations}
          />
        ) : (
          <div className="chat-empty">
            <h3>Bienvenue sur SOUKLOU 🎓</h3>
            <p>Sélectionnez une conversation ou démarrez-en une nouvelle</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
