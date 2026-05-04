import express from 'express';
import { 
    marcarAsistencia, 
    getAsistenciaMonitoria, 
    getAsistenciasEstudiante 
} from '../controllers/asistenciaController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/', marcarAsistencia);
router.get('/monitoria/:id_monitoria', getAsistenciaMonitoria);
router.get('/estudiante/:id_estudiante', getAsistenciasEstudiante);

export default router;
