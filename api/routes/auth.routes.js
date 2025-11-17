// /api/routes/auth.routes.js
import express from 'express';
import { AuthAPIController } from '../controllers/auth.controller.js';

const router = express.Router();

// Define a rota de login
router.post('/auth/login', AuthAPIController.login);

router.post('/auth/register', AuthAPIController.register);

export default router;

