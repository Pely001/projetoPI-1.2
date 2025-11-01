// Função para pegar o ID da URL
function getLocationIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Função para inicializar o mapa com local específico
async function initMapWithLocation() {
    const locationId = getLocationIdFromURL();
    
    if (locationId) {
        try {
            // Busca dados do local específico
            const response = await fetch(`http://localhost:3000/api/locations/${locationId}`);
            const location = await response.json();
            
            // Centraliza o mapa nas coordenadas do local
            map.setView([location.coordinates.lat, location.coordinates.lng], 16);
            
            // Adiciona um marcador
            L.marker([location.coordinates.lat, location.coordinates.lng])
                .addTo(map)
                .bindPopup(location.name)
                .openPopup();
        } catch (error) {
            console.error('Erro ao carregar localização:', error);
        }
    }
}

// Chama a função quando o mapa estiver pronto
document.addEventListener('DOMContentLoaded', initMapWithLocation);