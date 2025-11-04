// /public/mapa/app.js

// Importa o "cérebro" da funcionalidade do mapa
import { LocationController } from './location.controller.js';

// Espera o HTML da página carregar e então "liga" o cérebro
document.addEventListener('DOMContentLoaded', () => {
  LocationController.init();
});

