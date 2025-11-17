// /public/js/localizacao-detail.js

let map;

async function loadLocation() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return showError("ID não encontrado");

  try {
    const res = await fetch(`/api/locations/${id}`);
    const json = await res.json();

    if (!res.ok) throw new Error("Local não encontrado");
    const loc = json;

    // === PREENCHE INFORMAÇÕES ===
    document.getElementById('loc-name').textContent = loc.name;
    document.getElementById('loc-address').textContent = loc.address;
    document.getElementById('loc-phone').textContent = loc.phone || "Não informado";
    document.getElementById('loc-menu').href = loc.menu_url || '#';

    // Vibe
    const vibe = loc.tags?.vibe?.[0]?.replace('_', ' ') || "Geral";
    document.getElementById('loc-vibe').textContent = vibe;

    // Google Maps (usa endereço)
    const encodedAddress = encodeURIComponent(loc.address);
    document.getElementById('loc-gmaps').href = 
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // === BUSCA COORDENADAS PELO ENDEREÇO ===
    const coords = await geocodeAddress(loc.address);
    if (!coords) {
      showError("Não foi possível localizar o endereço no mapa.");
      return;
    }

    // === INICIA O MAPA ===
    initMap(coords.lat, coords.lng, loc.name);

  } catch (err) {
    showError(err.message);
  }
}

// === BUSCA COORDENADAS PELO ENDEREÇO (Nominatim) ===
async function geocodeAddress(address) {
  try {
    const query = encodeURIComponent(address + ', Recife, PE, Brasil');
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=br`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'BGT-App/1.0 (contact@bgt.com)' }
    });

    const data = await res.json();
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (err) {
    console.error('Erro no geocoding:', err);
    return null;
  }
}

function initMap(lat, lng, name) {
  if (map) map.remove();

  map = L.map('map').setView([lat, lng], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const icon = L.divIcon({
    className: 'custom-pin',
    html: `
      <svg width="36" height="46" viewBox="0 0 36 46">
        <path d="M18 0C8.058 0 0 8.058 0 18C0 31.392 18 46 18 46C18 46 36 31.392 36 18C36 8.058 27.942 0 18 0Z" fill="#7b5cf0"/>
        <circle cx="18" cy="18" r="10" fill="#fff"/>
        <circle cx="18" cy="18" r="6" fill="#7b5cf0"/>
      </svg>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46]
  });

  L.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup(`<b>${name}</b>`)
    .openPopup();
}

function showError(msg) {
  document.querySelector('.detail-layout').innerHTML = `
    <div style="grid-column: 1 / -1; padding:40px; text-align:center; color:#aaa;">
      <h3>Erro</h3>
      <p>${msg}</p>
      <button onclick="history.back()" class="btn-back">Voltar</button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadLocation);