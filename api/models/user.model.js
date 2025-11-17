// /api/models/user.model.js
import { openDb } from '../../db/database.js';

export const UserAPIModel = {
  findByUsername: async (username) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
  },

  createUser: async ({ username, password_hash }) => {
    const db = await openDb();
    const safeName = name ?? username;
    const safeEmail = email ?? '';
    const result = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password_hash]
    );
    return { id: result.lastID, username };
  }

  // adicione outras funções se precisar (findById, findByEmail, etc.)
};