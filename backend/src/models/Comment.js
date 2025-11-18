import db from './database.js';

class Comment {
  static create({ submissionId, teacherId, content }) {
    const stmt = db.prepare(`
      INSERT INTO comments (submission_id, teacher_id, content)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(submissionId, teacherId, content);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT
        c.*,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom
      FROM comments c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
    `);
    return stmt.get(id);
  }

  static getBySubmissionId(submissionId) {
    const stmt = db.prepare(`
      SELECT
        c.*,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom
      FROM comments c
      JOIN users u ON c.teacher_id = u.id
      WHERE c.submission_id = ?
      ORDER BY c.created_at ASC
    `);
    return stmt.all(submissionId);
  }

  static update(id, content) {
    const stmt = db.prepare(`
      UPDATE comments
      SET content = ?
      WHERE id = ?
    `);

    stmt.run(content, id);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    return stmt.run(id);
  }
}

export default Comment;
