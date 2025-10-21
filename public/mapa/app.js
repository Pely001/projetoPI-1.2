// /public/mapa/app.js
import { LocationModel } from './location.model.js';
import { LocationView } from './location.view.js';

const LocationController = {
  
  allLocations: [], // Armazena todos os locais para evitar buscas repetidas

  init: async () => {
    // 1. Inicializa o mapa e a visão
    LocationView.initMap();
    LocationView.bindEvents(
      LocationController.handleFilterChange,
      LocationController.handleToggleView,
      LocationController.handleModalClose
    );

    // 2. Busca os dados da API
    LocationController.allLocations = await LocationModel.fetchAll();
    
    // 3. Renderiza os resultados iniciais
    LocationController.filterAndRender();
  },

  filterAndRender: () => {
    const { searchText, checkedFilters } = LocationView.getFilterValues();
    
    const filteredLocations = LocationController.allLocations.filter(loc => {
      const nameMatch = loc.name.toLowerCase().includes(searchText);
      
      // Se não houver filtros de checkbox, considera que passou
      if (checkedFilters.length === 0) return nameMatch;

      // Verifica se o local tem pelo menos uma das tags selecionadas
      const tagsMatch = checkedFilters.some(filter => loc.tags.vibe.includes(filter));

      return nameMatch && tagsMatch;
    });

    LocationView.renderResults(filteredLocations, LocationController.handleMarkerClick);
  },

  handleFilterChange: () => {
    LocationController.filterAndRender();
  },

  handleMarkerClick: (location) => {
    LocationView.showDetailsModal(location);
  },

  handleModalClose: () => {
    LocationView.hideDetailsModal();
  },

  handleToggleView: (view) => {
    LocationView.toggleView(view);
  }
};

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', LocationController.init);