import express from 'express';
import { 
    createComentario, 
    getComentariosMonitoria, 
    deleteComentario 
} from '../controllers/comentarioController.js';
import { authenticateToken } from '../modules/middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/', createComentario);
router.get('/monitoria/:id_monitoria', getComentariosMonitoria);
router.delete('/:id_comentario', deleteComentario);

export default router;
