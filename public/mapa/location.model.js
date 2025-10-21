// /public/mapa/location.model.js

const API_URL = '/api/locations';

export const LocationModel = {
  
  /**
   * Busca todos os locais da API.
   * @returns {Promise<Array>} Uma promessa que resolve para a lista de locais.
   */
  fetchAll: async () => {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (error) {
      console.error("Falha ao buscar locais:", error);
      return []; // Retorna um array vazio em caso de erro
    }
  }
};