// /public/mapa/location.controller.js
import { LocationModel } from './location.model.js';
import { LocationView } from './location.view.js';

export const LocationController = {
  
  allLocations: [], 

  async init() { 
    LocationView.init(); 
    LocationView.initMap();
    
    this.allLocations = await LocationModel.getAllLocations(); 
    
    // REMOVEMOS 'handleToggleView'
    LocationView.bindEvents(
      this.handleFilterChange.bind(this), 
      this.handleModalClose.bind(this)    
    );
    
    this.handleFilterChange();
    
    // REMOVEMOS 'LocationView.toggleView('map')'
    // O mapa agora está sempre visível
  },

  handleFilterChange() {
    const { searchText, checkedFilters } = LocationView.getFilterValues();
    
    const filteredLocations = this.allLocations.filter(loc => { 
      const nameMatch = loc.name.toLowerCase().includes(searchText);
      const allTags = [
        ...(loc.tags.vibe || []),
        ...(loc.tags.occasion || []),
        ...(loc.tags.amenities || [])
      ];
      const tagsMatch = checkedFilters.every(filterTag => allTags.includes(filterTag));
      return nameMatch && tagsMatch;
    });
    
    LocationView.renderResults(filteredLocations, this.handleMarkerClick.bind(this));
  },
  
  handleMarkerClick(location) {
    LocationView.showDetailsModal(location);
  },

  handleModalClose() {
    LocationView.hideDetailsModal();
  }

  // REMOVEMOS 'handleToggleView'
};