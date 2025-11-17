function UserList({ users, userRole, onSelectUser }) {
  const targetRole = userRole === 'eleve' ? 'professeur' : 'eleve'
  const targetRoleLabel = userRole === 'eleve' ? 'Professeurs' : 'Élèves'

  return (
    <div className="user-list">
      <h3>Démarrer une conversation avec un {targetRoleLabel.toLowerCase()}</h3>

      {users.length === 0 ? (
        <p className="empty-message">Aucun {targetRoleLabel.toLowerCase()} disponible</p>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => onSelectUser(user.id)}
            >
              <div className="user-avatar">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <div className="user-details">
                <h4>{user.prenom} {user.nom}</h4>
                <p>@{user.username}</p>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'eleve' ? 'Élève' : 'Professeur'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserList
