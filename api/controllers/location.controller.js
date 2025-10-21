// /api/controllers/location.controller.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para encontrar o caminho do arquivo de dados
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const locationsFilePath = path.join(__dirname, '..', 'data', 'locations.json');

export const LocationAPIController = {
  
  /**
   * Pega todos os locais de um arquivo JSON e envia como resposta.
   */
  getAllLocations: async (req, res) => {
    try {
      // 1. Lê o arquivo JSON diretamente
      const data = await fs.readFile(locationsFilePath, 'utf-8');
      const locations = JSON.parse(data);
      
      res.status(200).json(locations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar locais do banco de dados" });
    }
  },
};