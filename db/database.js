// /db/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Esta função assíncrona abre a conexão com o banco de dados
export async function openDb() {
  return open({
    filename: './db/database.db', // O arquivo do banco de dados
    driver: sqlite3.Database
  });
}