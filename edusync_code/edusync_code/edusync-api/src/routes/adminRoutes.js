import express from 'express';
import { createMateria, getAllUsers } from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['Administrador']));

router.post('/materias', createMateria);
router.get('/usuarios', getAllUsers);

export default router;
