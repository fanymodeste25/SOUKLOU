import db from './database.js';
import bcrypt from 'bcryptjs';

class User {
  static create({ username, email, password, role, nom, prenom }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, role, nom, prenom)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(username, email, hashedPassword, role, nom, prenom);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id);
    if (user) {
      delete user.password;
    }
    return user;
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static getAll() {
    const stmt = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users');
    return stmt.all();
  }

  static getAllByRole(role) {
    const stmt = db.prepare('SELECT id, username, email, role, nom, prenom, created_at FROM users WHERE role = ?');
    return stmt.all(role);
  }

  static comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

export default User;
