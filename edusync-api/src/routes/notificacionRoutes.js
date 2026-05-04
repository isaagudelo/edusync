import express from 'express';
import { 
    getNotificaciones, 
    markNotificacionLeida, 
    markAllNotificacionesLeidas,
    createNotificacion 
} from '../controllers/notificacionController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getNotificaciones);
router.put('/:id_notificacion/leida', markNotificacionLeida);
router.put('/marcar-todas-leidas', markAllNotificacionesLeidas);
router.post('/', createNotificacion);

export default router;
