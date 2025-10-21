// /data/locations.data.js
export const LOCATIONS_DB = [
  {
    id: 1,
    name: "Bar do Zé - Pinheiros",
    address: "Rua dos Pinheiros, 123, São Paulo",
    phone: "(11) 99999-1234",
    menu_url: "https://site.com/menu.pdf",
    lat: -23.565010,
    lng: -46.681970,
    curator_review: "Ótimo para happy hour! A porção de fritas é generosa e o chopp é gelado. Fica bem cheio depois das 18h.",
    tags: {
      vibe: ["agitado", "bom_para_grupos"],
      occasion: ["happy_hour"],
      price: "$$",
      amenities: ["pet_friendly_externo", "musica_ao_vivo"]
    }
  },
  {
    id: 2,
    name: "Cantina da Nona",
    address: "Rua Fradique Coutinho, 456, São Paulo",
    phone: "(11) 98888-5678",
    menu_url: "https://site.com/menu-cantina.pdf",
    lat: -23.560120,
    lng: -46.685340,
    curator_review: "Perfeito para um jantar romântico ou em família. O gnocchi ao sugo é fantástico. Ambiente silencioso.",
    tags: {
      vibe: ["calmo", "romantico"],
      occasion: ["jantar_familia", "date"],
      price: "$$$",
      amenities: ["acessivel_rampa", "wi_fi_bom"]
    }
  },
  {
    id: 3,
    name: "O Ponto do Café",
    address: "Rua Artur de Azevedo, 789, São Paulo",
    phone: "(11) 97777-4321",
    menu_url: "https://site.com/menu-cafe.pdf",
    lat: -23.563450,
    lng: -46.679880,
    curator_review: "O melhor lugar para trabalhar. Várias tomadas, Wi-Fi rápido e o café coado é excelente.",
    tags: {
      vibe: ["calmo", "bom_para_trabalhar"],
      occasion: ["trabalhar_sozinho"],
      price: "$",
      amenities: ["wi_fi_bom", "tomadas_nas_mesas"]
    }
  }
];