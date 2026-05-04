import express from 'express';
import { register, login, updateProfile } from '../controllers/authController.js';
import { getAllUsers, createMateria } from '../controllers/adminController.js'; // Importa la función para obtener usuarios

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile/:id', updateProfile);
router.get('/admin/usuarios', getAllUsers);

export default router;