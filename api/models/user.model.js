// /api/models/user.model.js
import { openDb } from '../../db/database.js';

export const UserAPIModel = {
  findByUsername: async (username) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
  },

  createUser: async ({ username, email, password_hash, name }) => {
    const db = await openDb();
    const safeName = name ?? username;
    const safeEmail = email ?? '';
    const result = await db.run(
      'INSERT INTO users (username, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [username, safeEmail, password_hash, safeName]
    );
    return { id: result.lastID, username, name: safeName };
  }

  // adicione outras funções se precisar (findById, findByEmail, etc.)
};