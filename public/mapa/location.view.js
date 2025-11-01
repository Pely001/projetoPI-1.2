// /public/mapa/location.view.js

let DOM = {}; 
let mapInstance = null; 
let mapMarkers = [];    

export const LocationView = {
  
  init: () => {
    DOM.listContainer = document.getElementById('list-container');
    DOM.mapContainer = document.getElementById('map');
    DOM.modal = document.getElementById('details-modal');
    DOM.modalCloseBtn = document.getElementById('modal-close');
    // REMOVEMOS os botões showMapBtn e showListBtn
  },
  
  initMap: () => {
    const MAP_START_COORDS = [-8.05, -34.89]; // Centralizado em Recife
    mapInstance = L.map('map').setView(MAP_START_COORDS, 13); // Zoom um pouco mais distante
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance);
    return mapInstance;
  },

  getFilterValues: () => {
    const searchText = document.getElementById('search-text').value.toLowerCase();
    const filterInputs = document.querySelectorAll('.filter-sidebar input[type="checkbox"]'); 
    const checkedFilters = Array.from(filterInputs)
      .filter(input => input.checked)
      .map(input => input.value);
    return { searchText, checkedFilters };
  },

  renderResults: (locations, onMarkerClickCallback) => {
    DOM.listContainer.innerHTML = ''; 
    mapMarkers.forEach(marker => marker.remove());
    mapMarkers = [];
    
    if (locations.length === 0) {
      DOM.listContainer.innerHTML = '<p>Nenhum local encontrado com esses filtros.</p>';
      return;
    }

    locations.forEach(loc => {
      // Cria item na lista (que agora está na sidebar)
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.innerHTML = `
        <h3>${loc.name}</h3>
        <p>${loc.address}</p>
        <p class="curator-review">"${loc.curator_review}"</p>
      `;
      listItem.addEventListener('click', () => onMarkerClickCallback(loc));
      DOM.listContainer.appendChild(listItem);
      
      // Cria pino no mapa
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(mapInstance)
        .bindPopup(`<b>${loc.name}</b><br>Clique para ver detalhes.`);
      marker.on('click', () => onMarkerClickCallback(loc));
      mapMarkers.push(marker);
    });

    if (mapMarkers.length > 0) {
      const group = L.featureGroup(mapMarkers);
      mapInstance.fitBounds(group.getBounds().pad(0.3));
    } else {
      // Se não houver resultados, volta para a visão geral de Recife
      mapInstance.setView([-8.05, -34.89], 13);
    }
  },

  showDetailsModal: (location) => {
    // (Função continua exatamente igual)
  },

  hideDetailsModal: () => {
    // (Função continua exatamente igual)
  },

  // REMOVEMOS A FUNÇÃO 'toggleView'

  bindEvents: (onFilterChangeHandler, onModalCloseHandler) => {
    // REMOVEMOS o 'onToggleViewHandler'
    document.querySelectorAll('.filter-sidebar input').forEach(input => { 
      input.addEventListener('change', onFilterChangeHandler);
      input.addEventListener('keyup', onFilterChangeHandler);
    });
    
    // REMOVEMOS os listeners dos botões de alternância
    
    DOM.modalCloseBtn.addEventListener('click', onModalCloseHandler);
    DOM.modal.addEventListener('click', (e) => {
      if (e.target === DOM.modal) onModalCloseHandler();
    });
  }
};