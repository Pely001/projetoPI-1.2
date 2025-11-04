// /public/js/localizacao-detail.js

let map, marker;

async function loadLocation() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return showError("ID não encontrado");

  try {
    const res = await fetch(`http://localhost:3000/api/locations/${id}`);
    if (!res.ok) throw new Error("Local não encontrado");
    const loc = await res.json();

    // Preenche informações
    document.getElementById('loc-name').textContent = loc.name;
    document.getElementById('loc-address').textContent = loc.address;
    document.getElementById('loc-phone').textContent = loc.phone || "Não informado";
    document.getElementById('loc-menu').href = loc.menu_url || '#';

    // Vibe
    const vibe = loc.tags.vibe?.[0]?.replace('_', ' ') || "Geral";
    document.getElementById('loc-vibe').textContent = vibe;

    // Google Maps
    const gmaps = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
    document.getElementById('loc-gmaps').href = gmaps;

    // Mapa OpenStreetMap
    initMap(loc.lat, loc.lng, loc.name);

  } catch (err) {
    showError(err.message);
  }
}

function initMap(lat, lng, name) {
  if (map) map.remove();

  map = L.map('map').setView([lat, lng], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Pin personalizado
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

  L.marker([lat, lng], { icon }).addTo(map)
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

// Adicione no loadSelectedPlace
const hours = selected.hours || { weekday_text: [], open_now: false };
const status = hours.open_now ? 'Aberto agora' : 'Fechado';
const todayHours = hours.weekday_text ? hours.weekday_text[new Date().getDay()] : 'Horário não disponível';

// Adicione no HTML (opcional): <p id="loc-hours" class="status">${status} • ${todayHours}</p>
document.getElementById('loc-hours').innerHTML = `${status} • ${todayHours}`;