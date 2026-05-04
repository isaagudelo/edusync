import pool from '../config/db.js';

export const createCalificacion = async (req, res) => {
    try {
        const { id_monitoria, id_calificado, Puntuacion, Comentario } = req.body;
        const id_calificador = req.user.id_usuario;
        
        // Verificar que el usuario pueda calificar esta monitoría
        const [monitoria] = await pool.query(
            'SELECT * FROM Monitoria WHERE id_monitoria = ? AND (id_estudiante = ? OR id_asignacion IN (SELECT id_asignacion FROM Asignacion_Monitor WHERE id_monitor = ?))',
            [id_monitoria, id_calificador, id_calificador]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No puedes calificar esta monitoría' });
        }
        
        await pool.query(
            'INSERT INTO Calificacion (id_monitoria, id_calificador, id_calificado, Puntuacion, Comentario) VALUES (?, ?, ?, ?, ?)',
            [id_monitoria, id_calificador, id_calificado, Puntuacion, Comentario]
        );
        
        res.json({ message: 'Calificación creada exitosamente' });
    } catch (error) {
        console.error('Error en createCalificacion:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getCalificacionesMonitor = async (req, res) => {
    try {
        const { id_monitor } = req.params;
        
        const [rows] = await pool.query(
            `SELECT c.*, u.Nombre as NombreCalificador, m.Estado as EstadoMonitoria
             FROM Calificacion c
             JOIN Usuario u ON c.id_calificador = u.id_usuario
             JOIN Monitoria m ON c.id_monitoria = m.id_monitoria
             WHERE c.id_calificado = ?
             ORDER BY c.Fecha_Calificacion DESC`,
            [id_monitor]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getCalificacionesMonitor:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getCalificacionesEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        
        const [rows] = await pool.query(
            `SELECT c.*, u.Nombre as NombreCalificado, m.Estado as EstadoMonitoria
             FROM Calificacion c
             JOIN Usuario u ON c.id_calificado = u.id_usuario
             JOIN Monitoria m ON c.id_monitoria = m.id_monitoria
             WHERE c.id_calificador = ?
             ORDER BY c.Fecha_Calificacion DESC`,
            [id_estudiante]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getCalificacionesEstudiante:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getCalificacionMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        
        const [rows] = await pool.query(
            `SELECT c.*, 
                    uc.Nombre as NombreCalificador, uc.Tipo_Usuario as TipoCalificador,
                    ucal.Nombre as NombreCalificado, ucal.Tipo_Usuario as TipoCalificado
             FROM Calificacion c
             JOIN Usuario uc ON c.id_calificador = uc.id_usuario
             JOIN Usuario ucal ON c.id_calificado = ucal.id_usuario
             WHERE c.id_monitoria = ?`,
            [id_monitoria]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getCalificacionMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
