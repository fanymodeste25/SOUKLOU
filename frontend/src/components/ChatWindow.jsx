import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

function ChatWindow({ conversation, currentUser, socket, onConversationUpdate }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    loadMessages()

    // Écouter les nouveaux messages via socket
    if (socket) {
      socket.on('new_message', handleNewMessage)
      socket.on('user_typing', handleUserTyping)
      socket.on('user_stop_typing', handleUserStopTyping)

      // Marquer comme lu
      socket.emit('mark_as_read', { conversationId: conversation.id })
    }

    return () => {
      if (socket) {
        socket.off('new_message', handleNewMessage)
        socket.off('user_typing', handleUserTyping)
        socket.off('user_stop_typing', handleUserStopTyping)
      }
    }
  }, [conversation.id, socket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    const result = await api.getMessages(conversation.id)
    if (result.messages) {
      setMessages(result.messages)
    }
    setLoading(false)
  }

  const handleNewMessage = (message) => {
    if (message.conversation_id === conversation.id) {
      setMessages((prev) => [...prev, message])
      onConversationUpdate()

      // Marquer comme lu si c'est un message de l'autre utilisateur
      if (message.sender_id !== currentUser.id && socket) {
        socket.emit('mark_as_read', { conversationId: conversation.id })
      }
    }
  }

  const handleUserTyping = (data) => {
    if (data.conversationId === conversation.id && data.userId !== currentUser.id) {
      setIsTyping(true)
    }
  }

  const handleUserStopTyping = (data) => {
    if (data.conversationId === conversation.id) {
      setIsTyping(false)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (newMessage.trim() === '' || !socket) return

    socket.emit('send_message', {
      conversationId: conversation.id,
      content: newMessage.trim()
    })

    setNewMessage('')
    socket.emit('stop_typing', { conversationId: conversation.id })
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)

    if (!socket) return

    // Émettre l'événement "typing"
    socket.emit('typing', { conversationId: conversation.id })

    // Arrêter de taper après 1 seconde d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { conversationId: conversation.id })
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-window-user">
          <div className="user-avatar">
            {conversation.other_prenom?.[0]}{conversation.other_nom?.[0]}
          </div>
          <div>
            <h3>{conversation.other_prenom} {conversation.other_nom}</h3>
            <span className={`role-badge ${conversation.other_role}`}>
              {conversation.other_role === 'eleve' ? 'Élève' : 'Professeur'}
            </span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Chargement des messages...</div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>Aucun message pour le moment</p>
            <p>Envoyez le premier message !</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender_id === currentUser.id ? 'sent' : 'received'
                }`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatMessageTime(message.created_at)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Écrivez votre message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Envoyer
        </button>
      </form>
    </div>
  )
}

export default ChatWindow
