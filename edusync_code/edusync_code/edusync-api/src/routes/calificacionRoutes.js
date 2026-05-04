import express from 'express';
import { 
    createCalificacion, 
    getCalificacionesMonitor, 
    getCalificacionesEstudiante, 
    getCalificacionMonitoria 
} from '../controllers/calificacionController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/', createCalificacion);
router.get('/monitor/:id_monitor', getCalificacionesMonitor);
router.get('/estudiante/:id_estudiante', getCalificacionesEstudiante);
router.get('/monitoria/:id_monitoria', getCalificacionMonitoria);

export default router;
