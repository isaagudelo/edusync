import express from 'express';
import { createMateria, getAllUsers, asignarMateria, getAsignaciones, deleteAsignacion, updateUserStatus } from './admin.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRole(['Administrador']));

router.post('/materias', createMateria);
router.get('/usuarios', getAllUsers);
router.post('/asignar-materia', asignarMateria);
router.get('/asignaciones', getAsignaciones);
router.delete('/asignaciones/:id', deleteAsignacion);
router.put('/usuarios/:id/estado', updateUserStatus);

export default router;
