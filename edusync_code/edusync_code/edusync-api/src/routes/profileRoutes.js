import express from 'express';
import { getProfile, updateProfile, uploadProfilePicture } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de perfil requieren autenticación
router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', uploadProfilePicture);

export default router;
