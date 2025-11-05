// /public/js/localizacao-detail.js

let map;

function loadPlace() {
  // Lê os dados salvos na pesquisa
  const place = JSON.parse(localStorage.getItem('selectedPlace'));

  // Se não houver dados, volta ou mostra erro
  if (!place) {
    alert('Nenhum local selecionado.');
    history.back();
    return;
  }

  // === PREENCHE INFORMAÇÕES ===
  document.getElementById('loc-name').textContent = place.name || 'Local sem nome';

  document.getElementById('loc-address').textContent = place.address || 'Endereço não disponível';

  document.getElementById('loc-phone').textContent = place.phone || 'Não informado';

  // Botão Ver Cardápio
  const menuBtn = document.getElementById('loc-menu');
  menuBtn.href = place.menu_url || '#';
  menuBtn.textContent = place.menu_url && place.menu_url !== '#' ? 'Ver Cardápio' : 'Cardápio não disponível';

  // === VIBE (TAG) ===
  const vibe = place.tags?.vibe?.[0] || 'Geral';
  const vibeEl = document.getElementById('loc-vibe');
  vibeEl.textContent = vibe;
  vibeEl.className = `tag vibe-${vibe.toLowerCase().replace(' ', '-')}`;

  // === STATUS: ABERTO / FECHADO + HORÁRIO ===
  const statusEl = document.getElementById('loc-status');
  if (statusEl) {
    const openNow = place.hours?.open_now ?? false;
    const todayIndex = new Date().getDay(); // 0=Dom, 1=Seg...
    const todayHours = place.hours?.weekday_text?.[todayIndex] || 'Horário não disponível';
    const statusText = openNow ? 'Aberto agora' : 'Fechado';

    statusEl.innerHTML = `<strong>${statusText}</strong> • ${todayHours}`;
    statusEl.className = `status ${openNow ? 'open' : 'closed'}`;
  }

  // === GOOGLE MAPS ===
  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
  document.getElementById('loc-gmaps').href = gmapsLink;

  // === INICIA O MAPA ===
  initMap(place.lat, place.lng, place.name);

  // Limpa o localStorage (opcional, evita dados velhos)
  // localStorage.removeItem('selectedPlace');
}

function initMap(lat, lng, name) {
  // Remove mapa antigo se existir
  if (map) map.remove();

  // Cria novo mapa
  map = L.map('map').setView([lat, lng], 17);

  // Tiles do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Pin personalizado (roxo com bolinha branca)
  const customIcon = L.divIcon({
    className: 'custom-pin',
    html: `
      <svg width="40" height="50" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 27.625 16 42 16 42C16 42 32 27.625 32 16C32 7.163 24.837 0 16 0Z" fill="#7b5cf0"/>
        <circle cx="16" cy="16" r="8" fill="#fff"/>
      </svg>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });

  // Adiciona o marcador com popup
  L.marker([lat, lng], { icon: customIcon })
    .addTo(map)
    .bindPopup(`<b>${name}</b>`)
    .openPopup();
}

// Carrega ao abrir a página
document.addEventListener('DOMContentLoaded', loadPlace);