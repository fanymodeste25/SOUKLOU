import { useState, useEffect } from 'react'
import { api } from '../services/api'
import UserList from './UserList'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

function Chat({ user, socket }) {
  const [conversations, setConversations] = useState([])
  const [users, setUsers] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [showUserList, setShowUserList] = useState(false)

  useEffect(() => {
    if (!socket) return;

    // Écouter les événements socket
    socket.on('new_message', loadConversations)
    socket.on('notification', loadConversations)

    // Charger les données initiales
    loadConversations()
    loadUsers()

    return () => {
      if (socket) {
        socket.off('new_message', loadConversations)
        socket.off('notification', loadConversations)
      }
    }
  }, [socket])

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

  return (
    <div className="chat-view">
      <div className="chat-sidebar-view">
        <button className="new-conversation-btn" onClick={handleNewConversation}>
          + Nouvelle conversation
        </button>

        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className="chat-main-view">
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
            <h3>Bienvenue dans la messagerie 💬</h3>
            <p>Sélectionnez une conversation ou démarrez-en une nouvelle</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
