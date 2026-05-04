import express from 'express';
import { 
    getHistorialMonitoria, 
    getHistorialEstudiante, 
    modificarFechaMonitoria 
} from '../controllers/historialController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/monitoria/:id_monitoria', getHistorialMonitoria);
router.get('/estudiante/:id_estudiante', getHistorialEstudiante);
router.put('/monitoria/:id_monitoria/fecha', modificarFechaMonitoria);

export default router;
