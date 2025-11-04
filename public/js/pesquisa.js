// /public/js/pesquisa.js
let map, markers = [], userLat, userLng, currentFilter = 'all';
let debounceTimer;

// Geolocalização
function getUserLocation() {
  if (!navigator.geolocation) return Promise.reject('Geolocalização não suportada');
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
        resolve({ lat: userLat, lng: userLng });
      },
      err => reject('Permissão negada: ' + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// Debounce para busca
function debounceSearch(query) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => searchNominatim(query), 500);
}

// Busca Nominatim com filtros e geolocalização
async function searchNominatim(query) {
  if (!query.trim()) {
    document.getElementById('results-container').innerHTML = '<p class="text-muted">Digite algo para buscar...</p>';
    clearMap();
    return;
  }

  const headers = { 'User-Agent': 'BGT-App/1.0 (contact@bgt.com)' };

  // Filtros: layer=poi + featuretype (ex: amenity=restaurant)
  let filterParam = '';
  if (currentFilter === 'restaurant') filterParam = '&featureType=amenity&value=restaurant';
  else if (currentFilter === 'pharmacy') filterParam = '&featureType=amenity&value=pharmacy';

  // Geolocalização: viewbox e bounded (limita resultados próximos)
  let geoParam = '';
  if (userLat && userLng) {
    const bbox = [-34.95, -8.15, -34.85, -8.00]; // Bbox Recife (ajuste para sua região)
    geoParam = `&viewbox=${bbox[0]},${bbox[3]},${bbox[2]},${bbox[1]}&bounded=1`;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=br${filterParam}${geoParam}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Erro na API Nominatim');

    let results = await res.json();

    // Ordena por distância se geolocalizado
    if (userLat && userLng) {
      results = results.sort((a, b) => {
        const distA = getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(a.lon));
        const distB = getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lon));
        return distA - distB;
      });
    }

    // Busca horários reais via Google Places
    const placesWithHours = await Promise.all(results.map(async (result) => {
      const hours = await getGoogleHours(result);
      return { ...result, hours };
    }));

    if (placesWithHours.length === 0) {
      document.getElementById('results-container').innerHTML = '<p class="text-muted">Nenhum local encontrado.</p>';
      return;
    }

    displayResults(placesWithHours);
    displayOnMap(placesWithHours);
  } catch (err) {
    document.getElementById('results-container').innerHTML = `<p class="error">Erro: ${err.message}</p>`;
  }
}

// Distância Haversine (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Horários reais via Google Places API
async function getGoogleHours(nominatimPlace) {
  const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Substitua pela sua key
  if (!API_KEY || API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') return { weekday_text: [], open_now: false };

  try {
    // Usa display_name para buscar place_id
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(nominatimPlace.display_name)}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.results.length === 0) return { weekday_text: [], open_now: false };

    const placeId = searchData.results[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    return detailsData.result.opening_hours || { weekday_text: [], open_now: false };
  } catch (err) {
    console.error('Erro Google Places:', err);
    return { weekday_text: [], open_now: false };
  }
}

function displayResults(results) {
  const container = document.getElementById('results-container');
  if (results.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum local encontrado.</p>';
    return;
  }

  container.innerHTML = results.map((result, index) => {
    const name = result.display_name.split(',')[0];
    const address = result.display_name.split(', ').slice(1).join(', ');
    const type = result.category || 'Local';
    const hours = result.hours;
    const status = hours.open_now ? 'Aberto agora' : 'Fechado';
    const todayHours = hours.weekday_text ? hours.weekday_text[new Date().getDay()] : 'Horário não disponível';

    return `
      <div class="result-item" data-index="${index}">
        <h4>${name}</h4>
        <div class="type">${type}</div>
        <p class="address">${address}</p>
        <p class="status ${status === 'Aberto agora' ? 'open' : 'closed'}">${status} • ${todayHours}</p>
        <button class="btn-view-details" data-index="${index}">Ver detalhes</button>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      localStorage.setItem('selectedPlace', JSON.stringify(results[index]));
      window.location.href = `/localizacao.html`;
    });
  });
}

// Resto igual (displayOnMap, createCustomIcon, initMap, clearMap)
function displayOnMap(results) {
  clearMap();
  if (!map) initMap();

  const bounds = L.latLngBounds();

  results.forEach((result, index) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const name = result.display_name.split(',')[0];

    const marker = L.marker([lat, lng], { icon: createCustomIcon() })
      .addTo(map)
      .bindPopup(`<b>${name}</b><br>${result.display_name}<br>${result.hours?.weekday_text?.[0] || 'Horário N/A'}`)
      .on('click', () => {
        localStorage.setItem('selectedPlace', JSON.stringify(result));
        window.location.href = `/localizacao.html`;
      });

    markers.push(marker);
    bounds.extend([lat, lng]);
  });

  if (results.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

function createCustomIcon() {
  return L.divIcon({
    className: 'custom-pin',
    html: `<svg width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 27.625 16 42 16 42C16 42 32 27.625 32 16C32 7.163 24.837 0 16 0Z" fill="#7b5cf0"/>
      <circle cx="16" cy="16" r="8" fill="#fff"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42]
  });
}

function initMap() {
  // Centraliza no usuário se disponível
  const centerLat = userLat || -8.05;
  const centerLng = userLng || -34.9;
  map = L.map('map').setView([centerLat, centerLng], userLat ? 13 : 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function clearMap() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

// Eventos
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getUserLocation(); // Solicita permissão
    console.log('Geolocalização ativada!');
  } catch (err) {
    console.log('Geolocalização negada:', err);
  }
  initMap();
});

document.getElementById('search-input').addEventListener('input', (e) => {
  debounceSearch(e.target.value);
});

// Filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    // Re-busca com filtro atual
    const query = document.getElementById('search-input').value;
    if (query) searchNominatim(query);
  });
});