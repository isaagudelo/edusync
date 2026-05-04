import express from 'express';
import { 
    createSesionSegura, 
    getSesionMonitoria, 
    validateTokenSesion 
} from '../controllers/sesionController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/', createSesionSegura);
router.get('/monitoria/:id_monitoria', getSesionMonitoria);
router.post('/validate', validateTokenSesion);

export default router;
