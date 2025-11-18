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
  },

  // Assignments
  createAssignment: async (data) => {
    const response = await fetch(`${API_URL}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  getAssignments: async () => {
    const response = await fetch(`${API_URL}/assignments`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getAssignment: async (id) => {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  updateAssignment: async (id, data) => {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  deleteAssignment: async (id) => {
    const response = await fetch(`${API_URL}/assignments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
    return response.json()
  },

  // Submissions
  createSubmission: async (data) => {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  getSubmission: async (id) => {
    const response = await fetch(`${API_URL}/submissions/${id}`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getSubmissionsByAssignment: async (assignmentId) => {
    const response = await fetch(`${API_URL}/submissions/assignment/${assignmentId}`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getStudentSubmissions: async () => {
    const response = await fetch(`${API_URL}/submissions/my-submissions`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  updateSubmission: async (id, data) => {
    const response = await fetch(`${API_URL}/submissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Comments
  createComment: async (data) => {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  getCommentsBySubmission: async (submissionId) => {
    const response = await fetch(`${API_URL}/comments/submission/${submissionId}`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  // Notifications
  getNotifications: async () => {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getUnreadNotifications: async () => {
    const response = await fetch(`${API_URL}/notifications/unread`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  getNotificationCount: async () => {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: getAuthHeader()
    })
    return response.json()
  },

  markNotificationAsRead: async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeader()
    })
    return response.json()
  },

  markAllNotificationsAsRead: async () => {
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: getAuthHeader()
    })
    return response.json()
  }
}
