// /api/models/user.model.js
import { openDb } from '../../db/database.js';

export const UserAPIModel = {
  
  findByUsername: async (username) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE username = ?', username);
  },

  findByEmail: async (email) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE email = ?', email);
  },

  findByCNPJ: async (cnpj) => {
    const db = await openDb();
    return db.get('SELECT * FROM users WHERE cnpj = ?', cnpj);
  },

  createUser: async (userData) => {
    const db = await openDb();
    const { username, email, password_hash, tipo, cnpj, telefone } = userData;
    
    const result = await db.run(
      `INSERT INTO users (username, email, password_hash, tipo, cnpj, telefone, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [username, email || null, password_hash, tipo || 'usuario', cnpj || null, telefone || null]
    );

    return {
      id: result.lastID,
      username: username,
      email: email,
      tipo: tipo || 'usuario'
    };
  }
  
  // (Aqui você adicionaria 'findById', etc.)
};
