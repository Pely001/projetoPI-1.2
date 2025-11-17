// /public/mapa/location.model.js

export const LocationModel = {
  
  /**
   * Busca todos os locais na nossa API do Node.js
   */
  getAllLocations: async () => {
    try {
      // Faz a "chamada" para o backend
      const response = await fetch('/api/locations');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
      }
      
      // Entrega os dados em formato JSON
      const data = await response.json();
      return data;

    } catch (error) {
      console.error(error);
      return []; // Se der erro, entrega uma lista vazia
    }
  }
};