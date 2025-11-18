import db from './database.js';

class Submission {
  static create({ assignmentId, studentId, content, fileUrl }) {
    const stmt = db.prepare(`
      INSERT INTO submissions (assignment_id, student_id, content, file_url)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(assignmentId, studentId, content, fileUrl || null);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT
        s.*,
        a.title as assignment_title,
        a.description as assignment_description,
        u.nom as student_nom,
        u.prenom as student_prenom,
        u.email as student_email,
        (SELECT COUNT(*) FROM comments WHERE submission_id = s.id) as comment_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON s.student_id = u.id
      WHERE s.id = ?
    `);
    return stmt.get(id);
  }

  static findByAssignmentAndStudent(assignmentId, studentId) {
    const stmt = db.prepare(`
      SELECT s.*
      FROM submissions s
      WHERE s.assignment_id = ? AND s.student_id = ?
    `);
    return stmt.get(assignmentId, studentId);
  }

  static getByAssignmentId(assignmentId) {
    const stmt = db.prepare(`
      SELECT
        s.*,
        u.nom as student_nom,
        u.prenom as student_prenom,
        u.email as student_email,
        (SELECT COUNT(*) FROM comments WHERE submission_id = s.id) as comment_count
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = ?
      ORDER BY s.submitted_at DESC
    `);
    return stmt.all(assignmentId);
  }

  static getByStudentId(studentId) {
    const stmt = db.prepare(`
      SELECT
        s.*,
        a.title as assignment_title,
        a.description as assignment_description,
        a.due_date as assignment_due_date,
        u.nom as teacher_nom,
        u.prenom as teacher_prenom,
        (SELECT COUNT(*) FROM comments WHERE submission_id = s.id) as comment_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON a.teacher_id = u.id
      WHERE s.student_id = ?
      ORDER BY s.submitted_at DESC
    `);
    return stmt.all(studentId);
  }

  static update(id, { content, fileUrl, status, grade }) {
    const updates = [];
    const values = [];

    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (fileUrl !== undefined) {
      updates.push('file_url = ?');
      values.push(fileUrl);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (grade !== undefined) {
      updates.push('grade = ?');
      values.push(grade);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const stmt = db.prepare(`
      UPDATE submissions
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM submissions WHERE id = ?');
    return stmt.run(id);
  }
}

export default Submission;
