const API_URL = 'http://localhost:5000/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const api = {
  // Auth
  register: async (data) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  login: async (data) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getUsersByRole: async (role) => {
    const response = await fetch(`${API_URL}/users/role/${role}`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  // Chat
  getConversations: async () => {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  createConversation: async (userId) => {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ userId })
    })
    return response.json()
  },

  getMessages: async (conversationId) => {
    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/chat/unread-count`, {
      headers: getAuthHeader()
    })
    return response.json()
  }
}
