import db from './database.js';

class Assignment {
  static create({ teacherId, title, description, dueDate }) {
    const stmt = db.prepare(`
      INSERT INTO assignments (teacher_id, title, description, due_date)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(teacherId, title, description, dueDate);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT
        a.*,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submission_count
      FROM assignments a
      JOIN users u ON a.teacher_id = u.id
      WHERE a.id = ?
    `);
    return stmt.get(id);
  }

  static getAll() {
    const stmt = db.prepare(`
      SELECT
        a.*,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submission_count
      FROM assignments a
      JOIN users u ON a.teacher_id = u.id
      ORDER BY a.created_at DESC
    `);
    return stmt.all();
  }

  static getByTeacherId(teacherId) {
    const stmt = db.prepare(`
      SELECT
        a.*,
        (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id) as submission_count
      FROM assignments a
      WHERE a.teacher_id = ?
      ORDER BY a.created_at DESC
    `);
    return stmt.all(teacherId);
  }

  static getWithSubmissionStatus(studentId) {
    const stmt = db.prepare(`
      SELECT
        a.*,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom,
        s.id as submission_id,
        s.status as submission_status,
        s.grade as submission_grade,
        s.submitted_at
      FROM assignments a
      JOIN users u ON a.teacher_id = u.id
      LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ?
      ORDER BY a.created_at DESC
    `);
    return stmt.all(studentId);
  }

  static update(id, { title, description, dueDate }) {
    const stmt = db.prepare(`
      UPDATE assignments
      SET title = ?, description = ?, due_date = ?
      WHERE id = ?
    `);

    stmt.run(title, description, dueDate, id);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM assignments WHERE id = ?');
    return stmt.run(id);
  }
}

export default Assignment;
