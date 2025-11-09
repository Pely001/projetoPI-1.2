// /api/routes/auth.routes.js
import express from 'express';
import { AuthAPIController } from '../controllers/auth.controller.js';

const router = express.Router();

// Define a rota de login
router.post('/auth/login', AuthAPIController.login);

// Define a rota de registro
router.post('/auth/register', AuthAPIController.register);

// Define a rota de recuperação de senha
router.post('/auth/forgot-password', AuthAPIController.forgotPassword);

export default router;

