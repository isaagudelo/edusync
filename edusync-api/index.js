import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/modules/auth/index.js';
import adminRoutes from './src/modules/admin/index.js';
import monitoriasRoutes from './src/modules/monitorias/index.js';
import notificacionRoutes from './src/routes/notificacionRoutes.js';
import calificacionRoutes from './src/routes/calificacionRoutes.js';
import historialRoutes from './src/routes/historialRoutes.js';
import comentarioRoutes from './src/routes/comentarioRoutes.js';
import asistenciaRoutes from './src/routes/asistenciaRoutes.js';
import sesionRoutes from './src/routes/sesionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitorias', monitoriasRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/sesiones', sesionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de EDUSYNC corriendo en http://localhost:${PORT}`);
});