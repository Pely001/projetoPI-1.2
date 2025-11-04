// /data/locations.data.js
export const LOCATIONS_DB = [
  {
    id: 1,
    name: "Restaurante Coco Bambu Recife",
    address: "R. Padre Carapuceiro, 777 - Loja 82A - Boa Viagem, Recife - PE, 51020-900",
    phone: "(11) 99999-1234",
    menu_url: "https://site.com/menu.pdf",
    lat: -23.565010,
    lng: -46.681970,
    curator_review: "Ótimo para happy hour! A porção de fritas é generosa e o chopp é gelado. Fica bem cheio depois das 18h.",
    image_path: "/data/img/1.png",
    tags: {
      vibe: ["agitado", "bom_para_grupos"],
      occasion: ["happy_hour"],
      price: "$$",
      amenities: ["pet_friendly_externo", "musica_ao_vivo"],
      
    }
  },
  {
    id: 2,
    name: "Pizzaria Atlântico Olinda",
    address: "Av. Fagundes Varela, 111 - Jardim Atlântico, Olinda - PE",
    phone: "(11) 98888-5678",
    menu_url: "https://site.com/menu-cantina.pdf",
    lat: -23.560120,
    lng: -46.685340,
    curator_review: "Perfeito para um jantar romântico ou em família. O gnocchi ao sugo é fantástico. Ambiente silencioso.",
    image_path: "/data/img/2.png",
    tags: {
      vibe: ["calmo", "romantico"],
      occasion: ["jantar_familia", "date"],
      price: "$$$",
      amenities: ["acessivel_rampa", "wi_fi_bom"],
      
    }
  },
  {
    id: 3,
    name: "Restaurante Sabor Goiano",
    address: "BR-060 - Abadiânia, GO, 72940-000",
    phone: "(11) 97777-4321",
    menu_url: "https://site.com/menu-cafe.pdf",
    lat: -23.563450,
    lng: -46.679880,
    curator_review: "O melhor lugar para trabalhar. Várias tomadas, Wi-Fi rápido e o café coado é excelente.",
    image_path: "/data/img/3.png",
    tags: {
      vibe: ["calmo", "bom_para_trabalhar"],
      occasion: ["trabalhar_sozinho"],
      price: "$",
      amenities: ["wi_fi_bom", "tomadas_nas_mesas"],
      
    }
  },
  // ... (dentro da lista LOCATIONS_DB, depois do "O Ponto do Café")
  {
    id: 4,
    name: "Smash Burger Hamburgueria Caruaru",
    address: "Rua Santa Maria da Boa Vista, 297 Boa Vista 1, Caruaru - PE, 55038-090",
    phone: "(81) 3038-7080",
    menu_url: "https://cocobambu.com/unidade/derby",
    lat: -8.0553, // Coordenadas reais (aprox.)
    lng: -34.8985, // Coordenadas reais (aprox.)
    curator_review: "Frutos do mar excelentes, pratos muito bem servidos. Ótimo para ir em grupo ou com a família.",
    image_path: "/data/img/4.png",
    tags: {
      vibe: ["romantico", "bom_para_grupos"],
      occasion: ["jantar_familia", "date"],
      price: "$$$",
      amenities: ["acessivel_rampa", "wi_fi_bom"],
      
    }
  },
  {
    id: 5,
    name: "Vasto - Shopping Recife",
    address: "R. Padre Carapuceiro, 777 - Boa Viagem, Recife",
    phone: "(81) 3038-7080",
    menu_url: "https://vastorestaurante.com/vasto-recife/",
    lat: -8.1193, // Coordenadas reais (aprox.)
    lng: -34.9048, // Coordenadas reais (aprox.)
    curator_review: "Carnes nobres com um toque sofisticado. O ambiente é mais executivo e moderno.",
    image_path: "/data/img/5.png",
    tags: {
      vibe: ["agitado", "romantico"],
      occasion: ["date", "almoco_negocios"],
      price: "$$$",
      amenities: ["acessivel_rampa"],
    
    }
  }
// ... (feche o array com ])
  
];