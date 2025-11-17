// /api/models/user.model.js
import { openDb } from '../../db/database.js';

export const UserAPIModel = {
  findByUsername: async (username) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
  },

  createUser: async ({ username, email, password_hash }) => {
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );
    return { id: result.lastID, username, email };
  },

  findByEmail: async (email) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  // adicione outras funções se precisar (findById, findByEmail, etc.)
};