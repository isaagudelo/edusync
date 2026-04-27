import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js'; // No olvides el .js
import monitoriaRoutes from './src/routes/monitoriaRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/monitorias', monitoriaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de EDUSYNC corriendo en http://localhost:${PORT}`);
});