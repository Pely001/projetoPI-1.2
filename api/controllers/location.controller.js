// /api/controllers/location.controller.js
import { LocationAPIModel } from '../models/location.model.js';

export const LocationAPIController = {
  
  /**
   * Pega todos os locais e envia como JSON
   */
  getAllLocations: async (req, res) => {
    try {
      // 1. Chama o Model para buscar os dados
      const locations = await LocationAPIModel.getAll();
      
      // 2. Envia a resposta
      res.status(200).json(locations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar locais do banco de dados" });
    }
  },
};