function ConversationList({ conversations, selectedConversation, onSelectConversation }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 86400000) { // Moins de 24h
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (diff < 604800000) { // Moins d'une semaine
      return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <div className="conversation-list">
      {conversations.length === 0 ? (
        <p className="empty-message">Aucune conversation</p>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${
              selectedConversation?.id === conversation.id ? 'active' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="conversation-avatar">
              {conversation.other_prenom?.[0]}{conversation.other_nom?.[0]}
            </div>
            <div className="conversation-info">
              <div className="conversation-header">
                <h4>{conversation.other_prenom} {conversation.other_nom}</h4>
                <span className="conversation-time">
                  {formatTime(conversation.last_message_time)}
                </span>
              </div>
              <div className="conversation-preview">
                <p>{conversation.last_message || 'Pas de message'}</p>
                {conversation.unread_count > 0 && (
                  <span className="unread-badge">{conversation.unread_count}</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ConversationList
