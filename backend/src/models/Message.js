import db from './database.js';

class Message {
  static create({ conversationId, senderId, content }) {
    const stmt = db.prepare(`
      INSERT INTO messages (conversation_id, sender_id, content)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(conversationId, senderId, content);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT
        m.*,
        u.username as sender_username,
        u.nom as sender_nom,
        u.prenom as sender_prenom,
        u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `);
    return stmt.get(id);
  }

  static findByConversation(conversationId, limit = 50) {
    const stmt = db.prepare(`
      SELECT
        m.*,
        u.username as sender_username,
        u.nom as sender_nom,
        u.prenom as sender_prenom,
        u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at DESC
      LIMIT ?
    `);

    return stmt.all(conversationId, limit).reverse();
  }

  static markAsRead(conversationId, userId) {
    const stmt = db.prepare(`
      UPDATE messages
      SET read_status = 1
      WHERE conversation_id = ? AND sender_id != ? AND read_status = 0
    `);

    return stmt.run(conversationId, userId);
  }

  static getUnreadCount(userId) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE (c.user1_id = ? OR c.user2_id = ?)
      AND m.sender_id != ?
      AND m.read_status = 0
    `);

    const result = stmt.get(userId, userId, userId);
    return result.count;
  }
}

export default Message;
