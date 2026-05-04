import express from 'express';
import { 
  getMonitoresDisponibles, 
  agendarMonitoria, 
  getCitasEstudiante, 
  cancelarMonitoria, 
  createAvailability,
  getMaterias,
  getCitasMonitor,
  getDisponibilidadMonitor,
  updateEstadoMonitoria
} from './monitorias.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/disponibles', getMonitoresDisponibles);
router.get('/materias', getMaterias);
router.post('/agendar', agendarMonitoria);
router.get('/estudiante/:id', getCitasEstudiante);
router.get('/monitor/:id', getCitasMonitor);
router.delete('/cancelar/:id', cancelarMonitoria);
router.post('/disponibilidad', createAvailability);
router.get('/disponibilidad/:id', getDisponibilidadMonitor);
router.put('/:id/estado', updateEstadoMonitoria);

export default router;
