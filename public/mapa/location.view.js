// /public/mapa/location.view.js
// (Cole o conteúdo do location.view.js da resposta anterior aqui)
// É um arquivo longo, mas não mudou. Apenas garanta que ele está em /public/mapa/
const DOM = {
  listContainer: document.getElementById('list-container'),
  mapContainer: document.getElementById('map'),
  modal: document.getElementById('details-modal'),
  modalCloseBtn: document.getElementById('modal-close'),
  showMapBtn: document.getElementById('show-map-btn'),
  showListBtn: document.getElementById('show-list-btn')
};
let mapInstance = null;
let mapMarkers = [];

export const LocationView = {
  
  initMap: () => {
    const MAP_START_COORDS = [-23.563, -46.683];
    mapInstance = L.map('map').setView(MAP_START_COORDS, 15);
    // Trocando para um mapa com estilo mais limpo, parecido com o Google Maps
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    }).addTo(mapInstance);

    // Adicionando a barra de busca de endereço
    const searchControl = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
      style: 'bar', // Estilo da barra de busca
      showMarker: true, // Mostrar um marcador no local encontrado
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      autoClose: true, // Fechar resultados após selecionar
      searchLabel: 'Digite um endereço...', // Texto do placeholder
    });
    mapInstance.addControl(searchControl);

    return mapInstance;
  },

  getFilterValues: () => {
    const searchText = document.getElementById('search-text').value.toLowerCase();
    const filterInputs = document.querySelectorAll('.filter-sidebar input[type="checkbox"]'); // Seletor corrigido para filter-sidebar
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
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.innerHTML = `
        <h3>${loc.name}</h3>
        <p>${loc.address}</p>
        <p class="curator-review">"${loc.curator_review}"</p>
      `;
      listItem.addEventListener('click', () => onMarkerClickCallback(loc));
      DOM.listContainer.appendChild(listItem);
      
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(mapInstance)
        .bindPopup(`<b>${loc.name}</b><br>Clique para ver detalhes.`);
      marker.on('click', () => onMarkerClickCallback(loc));
      mapMarkers.push(marker);
    });

    if (mapMarkers.length > 0) {
      const group = L.featureGroup(mapMarkers);
      mapInstance.fitBounds(group.getBounds().pad(0.3));
    }
  },

  showDetailsModal: (location) => {
    document.getElementById('modal-name').textContent = location.name;
    document.getElementById('modal-review').textContent = `"${location.curator_review}"`;
    document.getElementById('modal-phone').textContent = location.phone;
    document.getElementById('modal-address').textContent = location.address;
    
    const menuLink = document.getElementById('modal-menu-link');
    menuLink.href = location.menu_url;
    menuLink.classList.toggle('hidden', !location.menu_url);

    const mapsLink = document.getElementById('modal-maps-link');
    mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    
    DOM.modal.classList.remove('hidden');
  },

  hideDetailsModal: () => {
    DOM.modal.classList.add('hidden');
  },

  toggleView: (view) => {
    if (view === 'map') {
      DOM.mapContainer.classList.remove('hidden');
      DOM.listContainer.classList.add('hidden');
      DOM.showMapBtn.classList.add('active');
      DOM.showListBtn.classList.remove('active');
      mapInstance.invalidateSize();
    } else {
      DOM.mapContainer.classList.add('hidden');
      DOM.listContainer.classList.remove('hidden');
      DOM.showMapBtn.classList.remove('active');
      DOM.showListBtn.classList.add('active');
    }
  },

  bindEvents: (onFilterChangeHandler, onToggleViewHandler, onModalCloseHandler) => {
    document.querySelectorAll('.filter-sidebar input').forEach(input => { // Seletor corrigido
      input.addEventListener('change', onFilterChangeHandler);
      input.addEventListener('keyup', onFilterChangeHandler);
    });
    DOM.showMapBtn.addEventListener('click', () => onToggleViewHandler('map'));
    DOM.showListBtn.addEventListener('click', () => onToggleViewHandler('list'));
    DOM.modalCloseBtn.addEventListener('click', onModalCloseHandler);
    DOM.modal.addEventListener('click', (e) => {
      if (e.target === DOM.modal) onModalCloseHandler();
    });
  }
};