// /db/init.js
import { openDb } from './database.js';
import { LOCATIONS_DB } from '../data/locations.data.js';
import bcrypt from 'bcryptjs';

console.log("Iniciando a criação do banco de dados...");

async function initializeDatabase() {
  const db = await openDb();

  // 1. Criar a tabela 'locations' (Igual)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY, name TEXT NOT NULL, address TEXT, phone TEXT,
      menu_url TEXT, lat REAL, lng REAL, curator_review TEXT, tags TEXT,
      image_path TEXT  
    );
  `);
  console.log("Tabela 'locations' verificada/criada.");

  // 2. Criar a tabela 'users' (NOVO)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT,
      password_hash TEXT NOT NULL,
      tipo TEXT DEFAULT 'usuario',
      cnpj TEXT,
      telefone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Tabela 'users' verificada/criada.");

  // --- Popular Tabela 'locations' (Igual) ---
  const insertLocStmt = await db.prepare(
    `INSERT INTO locations (id, name, address, phone, menu_url, lat, lng, curator_review, tags) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let locCount = 0;
  for (const loc of LOCATIONS_DB) {
    const exists = await db.get('SELECT 1 FROM locations WHERE id = ?', loc.id);
    if (!exists) {
      await insertLocStmt.run(
        loc.id, loc.name, loc.address, loc.phone, loc.menu_url,
        loc.lat, loc.lng, loc.curator_review, JSON.stringify(loc.tags) 
      );
      locCount++;
    }
  }
  await insertLocStmt.finalize();
  if (locCount > 0) console.log(`${locCount} locais novos inseridos.`);

  // --- Popular Tabela 'users' (NOVO) ---
  // Vamos criar um usuário de teste
  const testUser = 'admin';
  const testEmail = 'admin@admin.com';
  const testPass = '1234';
  
  const userExists = await db.get('SELECT 1 FROM users WHERE username = ?', testUser);
  if (!userExists) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(testPass, salt);
    await db.run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      testUser, testEmail, password_hash
    );
    console.log(`Usuário de teste '${testUser}' (senha: '${testPass}') criado.`);
  }

  console.log("Banco de dados inicializado.");
  await db.close();
}

initializeDatabase().catch(console.error);