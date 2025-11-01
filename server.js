// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importa as rotas de API
import locationRoutes from './api/routes/location.routes.js';
import authRoutes from './api/routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use('/data', express.static(path.join(__dirname, '/data')));

// --- ROTAS DA API ---
// O backend agora tem duas rotas de API
app.use('/api', authRoutes);
app.use('/api', locationRoutes);

// --- SERVIR O FRONTEND ---
// Define a pasta 'public' como a raiz dos arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas para servir as páginas HTML
// __dirname é o diretório atual do server.js

// A página de Login é aberta
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// A página de Localização (mapa)
app.get('/localizacao', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'localizacao.html'));
});

// A Página Inicial (Feed) é a rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});