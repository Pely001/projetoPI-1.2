// /api/models/user.model.js
import { openDb } from '../../db/database.js';

export const UserAPIModel = {
  
  findByUsername: async (username) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE username = ?', username);
  }
  
  // (Aqui você adicionaria 'create', 'findById', etc.)
};