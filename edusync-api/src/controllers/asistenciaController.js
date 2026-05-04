import pool from '../config/db.js';

export const marcarAsistencia = async (req, res) => {
    try {
        const { id_monitoria, Asistio, Hora_Llegada, Observaciones } = req.body;
        const id_estudiante = req.user.id_usuario;
        
        const [monitoria] = await pool.query(
            'SELECT * FROM Monitoria WHERE id_monitoria = ? AND id_estudiante = ?',
            [id_monitoria, id_estudiante]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No puedes marcar asistencia en esta monitoría' });
        }

        await pool.query(
            `INSERT INTO Asistencia (id_monitoria, id_estudiante, Asistio, Hora_Llegada, Observaciones)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             Asistio = VALUES(Asistio),
             Hora_Llegada = VALUES(Hora_Llegada),
             Observaciones = VALUES(Observaciones),
             Fecha_Registro = NOW()`,
            [id_monitoria, id_estudiante, Asistio, Hora_Llegada, Observaciones]
        );

        res.json({ message: 'Asistencia marcada exitosamente' });
    } catch (error) {
        console.error('Error en marcarAsistencia:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getAsistenciaMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        
        const [rows] = await pool.query(
            `SELECT a.*, u.Nombre, u.Apellidos
             FROM Asistencia a
             JOIN Usuario u ON a.id_estudiante = u.id_usuario
             WHERE a.id_monitoria = ?`,
            [id_monitoria]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error en getAsistenciaMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getAsistenciasEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        
        const [rows] = await pool.query(
            `SELECT a.*, m.Estado as EstadoMonitoria, mat.Nombre as Materia
             FROM Asistencia a
             JOIN Monitoria m ON a.id_monitoria = m.id_monitoria
             JOIN Asignacion_Monitor am ON m.id_asignacion = am.id_asignacion
             JOIN Materia mat ON am.id_materia = mat.id_materia
             WHERE a.id_estudiante = ?
             ORDER BY a.Fecha_Registro DESC`,
            [id_estudiante]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getAsistenciasEstudiante:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
