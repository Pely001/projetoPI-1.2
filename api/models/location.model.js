// /api/models/location.model.js
import { openDb } from '../../db/database.js';

export const LocationAPIModel = {
  
  /**
   * Busca todos os locais no banco de dados SQLite
   */
  getAll: async () => {
    const db = await openDb();
    
    // 1. Executa a consulta SQL
    const locations = await db.all('SELECT * FROM locations');
    
    // 2. IMPORTANTE: Converte a string JSON 'tags' de volta para um objeto
    return locations.map(loc => ({
      ...loc,
      tags: JSON.parse(loc.tags) 
    }));
  }
  
  // No futuro, você pode adicionar:
  // getById: async (id) => { ... db.get('... WHERE id = ?', id) }
};