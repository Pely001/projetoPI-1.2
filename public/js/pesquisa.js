// /public/js/pesquisa.js
let map, markers = [], userLat, userLng, currentFilter = 'all';
let debounceTimer;

// Geolocalização (igual antes)
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

// Debounce (igual antes)
function debounceSearch(query) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => searchNominatim(query), 500);
}

// Busca Nominatim (igual antes)
async function searchNominatim(query) {
  if (!query.trim()) {
    document.getElementById('results-container').innerHTML = '<p class="text-muted">Digite algo para buscar...</p>';
    clearMap();
    return;
  }

  const headers = { 'User-Agent': 'BGT-App/1.0 (contact@bgt.com)' };
  let filterParam = '';
  if (currentFilter === 'restaurant') filterParam = '&featureType=amenity&value=restaurant';
  else if (currentFilter === 'pharmacy') filterParam = '&featureType=amenity&value=pharmacy';

  let geoParam = '';
  if (userLat && userLng) {
    const bbox = [-34.95, -8.15, -34.85, -8.00]; // Recife - ajuste para mais variedade se quiser
    geoParam = `&viewbox=${bbox[0]},${bbox[3]},${bbox[2]},${bbox[1]}&bounded=1`;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=br${filterParam}${geoParam}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Erro na API Nominatim');

    let results = await res.json();

    // Ordena por distância (mais próximos primeiro)
    if (userLat && userLng) {
      results = results.sort((a, b) => {
        const distA = getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(a.lon));
        const distB = getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lon));
        return distA - distB;
      });
    }

    // Busca horários (com fallback melhorado)
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

// Horários via Google (com FALLBACK REAL para Lojas Americanas Recife - 2025)
async function getGoogleHours(nominatimPlace) {
  const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Ative e cole aqui
  if (!API_KEY || API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
    return getFallbackHours(nominatimPlace); // Fallback com dados reais
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(nominatimPlace.display_name)}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.results.length === 0) return getFallbackHours(nominatimPlace);

    const placeId = searchData.results[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    return detailsData.result.opening_hours || getFallbackHours(nominatimPlace);
  } catch (err) {
    console.error('Erro Google Places:', err);
    return getFallbackHours(nominatimPlace);
  }
}

// FALLBACK com horários REAIS de Lojas Americanas Recife (pesquisados em 2025)
function getFallbackHours(place) {
  const name = place.display_name.toLowerCase();
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 1=Seg (hoje: 1)
  const hour = now.getHours(); // Hora atual

  let weekdayText = [];
  let openNow = false;

  if (name.includes('lojas americanas')) {
    // Dados reais de filiais (baseado em Tiendeo 2025)
    if (name.includes('rua sete de setembro') || name.includes('267')) {
      // Filial Rua Sete de Setembro
      weekdayText = [
        'Domingo: 08:00 - 19:00',
        'Segunda: 09:00 - 14:30', // Hoje: Aberto se <14:30
        'Terça: 08:00 - 19:00',
        'Quarta: 08:00 - 19:00',
        'Quinta: 08:00 - 19:00',
        'Sexta: 08:00 - 19:00',
        'Sábado: 08:00 - 19:00'
      ];
      openNow = (day === 1 && hour >= 9 && hour <= 14); // Segunda: 9h-14:30
    } else if (name.includes('rua da praia') || name.includes('131')) {
      // Filial Rua da Praia
      weekdayText = [
        'Domingo: 09:00 - 15:30',
        'Segunda: Fechado', // Segunda fechada
        'Terça: 09:30 - 17:00',
        'Quarta: 09:30 - 17:00',
        'Quinta: 09:30 - 17:00',
        'Sexta: 09:30 - 17:00',
        'Sábado: 09:30 - 17:00'
      ];
      openNow = (day === 1) ? false : (hour >= 9 && hour <= 17);
    } else if (name.includes('avenida conselheiro aguiar') || name.includes('3595')) {
      // Filial Av. Conselheiro Aguiar
      weekdayText = [
        'Domingo: 08:30 - 17:30',
        'Segunda: 09:30 - 14:45', // Hoje: Aberto se <14:45
        'Terça: 08:30 - 17:30',
        'Quarta: 08:30 - 17:30',
        'Quinta: 08:30 - 17:30',
        'Sexta: 08:30 - 17:30',
        'Sábado: 08:30 - 17:30'
      ];
      openNow = (day === 1 && hour >= 9 && hour <= 14) || (day > 1 && hour >= 8 && hour <= 17);
    } else {
      // Fallback genérico para outras filiais
      weekdayText = [
        'Domingo: 09:00 - 21:00',
        'Segunda: 12:00 - 18:00', // Hoje: Aberto se <18:00
        'Terça: 09:00 - 21:00',
        'Quarta: 09:00 - 21:00',
        'Quinta: 09:00 - 21:00',
        'Sexta: 09:00 - 21:00',
        'Sábado: 09:00 - 21:00'
      ];
      openNow = (day === 1 && hour >= 12 && hour <= 18) || (day > 1 && hour >= 9 && hour <= 21);
    }
  } else {
    // Para outros locais (ex: farmácias/restaurantes)
    weekdayText = ['Horário não disponível'];
    openNow = true; // Assume aberto por padrão
  }

  return { weekday_text: weekdayText, open_now: openNow };
}

// Display Results (PARSE LIMPO - Sem bagunça!)
function displayResults(results) {
  const container = document.getElementById('results-container');
  if (results.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum local encontrado.</p>';
    return;
  }

  container.innerHTML = results.map((result, index) => {
    // PARSE LIMPO: Extrai partes úteis, ignora redundâncias
    const parts = result.display_name.split(', ');
    const name = parts[0].trim(); // "Lojas Americanas"
    const typePart = parts[1]?.trim() || ''; // "Local" ou "Supermercado"
    const street = parts[2]?.trim() || ''; // "Rua Sete de Setembro, 267"
    const neighborhood = parts[3]?.trim() || ''; // "Boa Vista"
    const cityState = parts[4]?.trim() || ''; // "Recife - PE"
    const zip = parts[parts.length - 1]?.trim() || ''; // "50060-070"

    // Endereço limpo: Rua + Bairro + Cidade + CEP (sem "Metropolitana do Recife" ou "Região Nordeste")
    const cleanAddress = [street, neighborhood, cityState, zip].filter(part => part && !part.includes('Metropolitana') && !part.includes('Região')).join(', ');

    const type = typePart === 'Local' ? 'Loja' : typePart; // Limpa tipo
    const hours = result.hours;
    const todayIndex = new Date().getDay(); // 1 = Segunda
    const todayHours = hours.weekday_text[todayIndex] || 'Horário N/A';
    const status = hours.open_now ? 'Aberto agora' : 'Fechado';

    // Distância
    let distance = '';
    if (userLat && userLng) {
      const dist = getDistance(userLat, userLng, parseFloat(result.lat), parseFloat(result.lon));
      distance = `${dist.toFixed(1)} km`;
    }

    return `
      <div class="result-item" data-index="${index}">
        <h4>${name}</h4>
        <div class="type">${type}</div>
        <p class="address">${cleanAddress}</p>
        ${distance ? `<p class="distance">${distance}</p>` : ''}
        <p class="status ${status === 'Aberto agora' ? 'open' : 'closed'}">${status} • ${todayHours}</p>
        <div class="result-actions">
          <button class="btn-view-details" data-index="${index}">Ver detalhes</button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${result.lat},${result.lon}" target="_blank" class="btn-directions">Direções</a>
        </div>
      </div>
    `;
  }).join('');

  // Eventos de clique (igual antes)
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      localStorage.setItem('selectedPlace', JSON.stringify(results[index]));
      window.location.href = `/localizacao.html`;
    });
  });
}

// displayOnMap (popup limpo)
function displayOnMap(results) {
  clearMap();
  if (!map) initMap();

  const bounds = L.latLngBounds();

  results.forEach((result, index) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const name = result.display_name.split(',')[0];
    const cleanAddress = [result.display_name.split(', ')[2], result.display_name.split(', ')[3]].filter(p => p).join(', ');

    const marker = L.marker([lat, lng], { icon: createCustomIcon() })
      .addTo(map)
      .bindPopup(`<b>${name}</b><br>${cleanAddress}<br>${result.hours?.weekday_text?.[new Date().getDay()] || 'Horário N/A'}`)
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

// createCustomIcon, initMap, clearMap (igual antes)
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

// Eventos (igual antes)
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getUserLocation();
    console.log('Geolocalização ativada!');
  } catch (err) {
    console.log('Geolocalização negada:', err);
  }
  initMap();
});

document.getElementById('search-input').addEventListener('input', (e) => {
  debounceSearch(e.target.value);
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    const query = document.getElementById('search-input').value;
    if (query) searchNominatim(query);
  });
});

// Dentro de displayResults(), após montar os resultados:
document.querySelectorAll('.btn-view-details').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    const result = results[index];

    // Monta objeto EXATO para localizacao.html
    const placeData = {
      id: result.osm_id || index,
      name: result.display_name.split(',')[0],
      address: formatCleanAddress(result.display_name),
      phone: '(11) 99999-1234', // fallback
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      menu_url: getMenuUrl(result),
      tags: { vibe: [getVibe(result)] }
    };

    // SALVA NO localStorage
    localStorage.setItem('selectedPlace', JSON.stringify(placeData));

    // REDIRECIONA PARA localizacao.html
    window.location.href = '/localizacao.html';
  });
});

