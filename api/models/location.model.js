// /api/models/location.model.js
import { openDb } from '../../db/database.js';

export const LocationAPIModel = {
  
  getAll: async () => {
    const db = await openDb();
    const locations = await db.all('SELECT * FROM locations');
    
    return locations.map(loc => {
      let parsedTags = { vibe: [], occasion: [], amenities: [] }; 
      try {
        if (loc.tags) {
          parsedTags = JSON.parse(loc.tags);
        }
      } catch (e) {
        console.error(`Erro ao parsear tags do local ID ${loc.id}:`, loc.tags, e);
      }
      
      return {
        ...loc,
        tags: parsedTags 
      };
    });
  }
};