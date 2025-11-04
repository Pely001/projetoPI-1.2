// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa as rotas de API
import locationRoutes from './api/routes/location.routes.js';
import authRoutes from './api/routes/auth.routes.js';

// IMPORTA O BANCO DE DADOS
import { LOCATIONS_DB } from './data/locations.data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use('/data', express.static(path.join(__dirname, 'data'))); // Corrigido: sem '/data' duplicado

// --- ROTAS DA API ---
app.use('/api', authRoutes);
app.use('/api', locationRoutes);

// ROTA PARA UM LOCAL POR ID (agora funciona!)
app.get('/api/locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const location = LOCATIONS_DB.find(loc => loc.id === id);
  if (!location) return res.status(404).json({ error: 'Local não encontrado' });
  res.json(location);
});

// --- SERVIR O FRONTEND ---
app.use(express.static(path.join(__dirname, 'public')));

// Rotas HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/localizacao', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'localizacao.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});