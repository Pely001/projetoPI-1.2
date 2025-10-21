// /api/routes/location.routes.js
import express from 'express';
import { LocationAPIController } from '../controllers/location.controller.js';

const router = express.Router();

// Um GET para /api/locations vai chamar a função getAllLocations
router.get('/locations', LocationAPIController.getAllLocations);

export default router;