// /public/mapa/location.controller.js
import { LocationModel } from './location.model.js'; // Caminho corrigido
import { LocationView } from './location.view.js'; // Caminho corrigido

export const LocationController = {
  
  allLocations: [], 

  init: async () => { 
    LocationView.initMap();
    this.allLocations = await LocationModel.getAllLocations();
    LocationView.bindEvents(
      this.handleFilterChange, 
      this.handleToggleView,   
      this.handleModalClose    
    );
    this.handleFilterChange();
    LocationView.toggleView('map');
  },

  handleFilterChange: () => {
    const { searchText, checkedFilters } = LocationView.getFilterValues();
    const filteredLocations = this.allLocations.filter(loc => {
      const nameMatch = loc.name.toLowerCase().includes(searchText);
      // As tags agora são objetos, então precisamos acessar os arrays dentro
      const allTags = [
        ...loc.tags.vibe, 
        ...loc.tags.occasion, 
        ...loc.tags.amenities
      ];
      const tagsMatch = checkedFilters.every(filterTag => allTags.includes(filterTag));
      return nameMatch && tagsMatch;
    });
    LocationView.renderResults(filteredLocations, this.handleMarkerClick);
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