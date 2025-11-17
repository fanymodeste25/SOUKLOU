import db from './database.js';

class Conversation {
  static create(user1Id, user2Id) {
    // S'assurer que user1_id < user2_id pour éviter les doublons
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO conversations (user1_id, user2_id)
      VALUES (?, ?)
    `);

    stmt.run(smallerId, largerId);

    return this.findByUsers(user1Id, user2Id);
  }

  static findByUsers(user1Id, user2Id) {
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    const stmt = db.prepare(`
      SELECT * FROM conversations
      WHERE user1_id = ? AND user2_id = ?
    `);

    return stmt.get(smallerId, largerId);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
    return stmt.get(id);
  }

  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT
        c.*,
        u1.id as other_user_id,
        u1.username as other_username,
        u1.nom as other_nom,
        u1.prenom as other_prenom,
        u1.role as other_role,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND read_status = 0) as unread_count
      FROM conversations c
      JOIN users u1 ON (
        CASE
          WHEN c.user1_id = ? THEN c.user2_id
          ELSE c.user1_id
        END = u1.id
      )
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY last_message_time DESC
    `);

    return stmt.all(userId, userId, userId, userId);
  }
}

export default Conversation;
