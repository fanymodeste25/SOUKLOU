import db from './database.js';

class Notification {
  static create({ userId, type, title, message, link }) {
    const stmt = db.prepare(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(userId, type, title, message, link || null);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
    return stmt.get(id);
  }

  static getByUserId(userId, limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static getUnreadByUserId(userId) {
    const stmt = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ? AND read_status = 0
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  }

  static getUnreadCount(userId) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ? AND read_status = 0
    `);
    const result = stmt.get(userId);
    return result.count;
  }

  static markAsRead(id) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET read_status = 1
      WHERE id = ?
    `);
    return stmt.run(id);
  }

  static markAllAsRead(userId) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET read_status = 1
      WHERE user_id = ? AND read_status = 0
    `);
    return stmt.run(userId);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    return stmt.run(id);
  }

  static deleteAllByUserId(userId) {
    const stmt = db.prepare('DELETE FROM notifications WHERE user_id = ?');
    return stmt.run(userId);
  }
}

export default Notification;
