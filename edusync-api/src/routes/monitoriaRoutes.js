import express from 'express';
import { getMonitoresDisponibles, agendarMonitoria, getCitasEstudiante, cancelarMonitoria, createAvailability, getMaterias } from '../controllers/monitoriaController.js';

const router = express.Router();

router.get('/disponibles', getMonitoresDisponibles);
router.get('/materias', getMaterias);
router.post('/agendar', agendarMonitoria);

router.get('/estudiante/:id', getCitasEstudiante);
router.delete('/cancelar/:id', cancelarMonitoria);
router.post('/disponibilidad', createAvailability);

export default router;