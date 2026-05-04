import express from 'express';
import { register, login } from './auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import pool from '../../config/db.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Rutas protegidas bajo /api/auth/profile
router.use(authenticateToken);
router.get('/profile', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_usuario, Nombre, Apellidos, Correo, Tipo_Usuario, Programa, 
              Foto_Perfil, Biografia, Telefono, Fecha_Creacion 
       FROM Usuario WHERE id_usuario = ?`,
      [req.user.id_usuario]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/profile', async (req, res) => {
  try {
    const { Nombre, Apellidos, Correo, Biografia, Telefono, Programa } = req.body;
    await pool.query(
      `UPDATE Usuario SET 
         Nombre = ?, Apellidos = ?, Correo = ?, Biografia = ?, 
         Telefono = ?, Programa = ?, Fecha_Actualizacion = NOW()
       WHERE id_usuario = ?`,
      [Nombre, Apellidos, Correo, Biografia, Telefono, Programa, req.user.id_usuario]
    );
    res.json({ message: 'Perfil actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [countMonitorias] = await pool.query(
      `SELECT COUNT(*) as total FROM Monitoria m
       LEFT JOIN Asignacion_Monitor am ON m.id_asignacion = am.id_asignacion
       WHERE m.id_estudiante = ? OR am.id_monitor = ?`,
      [id_usuario, id_usuario]
    );

    const [avgRating] = await pool.query(
      `SELECT COALESCE(AVG(Puntuacion), 0) as promedio, COUNT(*) as total_calificaciones
       FROM Calificacion WHERE id_calificado = ?`,
      [id_usuario]
    );

    const [attendance] = await pool.query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN Asistio = TRUE THEN 1 ELSE 0 END) as asistidas
       FROM Asistencia WHERE id_estudiante = ?`,
      [id_usuario]
    );

    const total = attendance[0].total || 0;
    const asistidas = attendance[0].asistidas || 0;
    const porcentaje = total > 0 ? Math.round((asistidas / total) * 100) : 0;

    res.json({
      totalMonitorias: countMonitorias[0].total,
      promedioCalificacion: parseFloat(avgRating[0].promedio).toFixed(1),
      totalCalificaciones: avgRating[0].total_calificaciones,
      porcentajeAsistencia: porcentaje
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
