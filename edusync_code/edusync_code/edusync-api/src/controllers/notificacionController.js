import pool from '../config/db.js';

export const getNotificaciones = async (req, res) => {
    try {
        const userId = req.user.id_usuario;
        const { no_leidas = false } = req.query;
        
        let query = `
            SELECT n.*, m.Estado as EstadoMonitoria
            FROM Notificacion n
            LEFT JOIN Monitoria m ON n.id_monitoria = m.id_monitoria
            WHERE n.id_usuario = ?
        `;
        
        const params = [userId];
        
        if (no_leidas === 'true') {
            query += ' AND n.Leida = FALSE';
        }
        
        query += ' ORDER BY n.Fecha_Envio DESC';
        
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error en getNotificaciones:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const markNotificacionLeida = async (req, res) => {
    try {
        const { id_notificacion } = req.params;
        const userId = req.user.id_usuario;
        
        const [result] = await pool.query(
            'UPDATE Notificacion SET Leida = TRUE WHERE id_notificacion = ? AND id_usuario = ?',
            [id_notificacion, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }
        
        res.json({ message: 'Notificación marcada como leída' });
    } catch (error) {
        console.error('Error en markNotificacionLeida:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const markAllNotificacionesLeidas = async (req, res) => {
    try {
        const userId = req.user.id_usuario;
        
        await pool.query(
            'UPDATE Notificacion SET Leida = TRUE WHERE id_usuario = ? AND Leida = FALSE',
            [userId]
        );
        
        res.json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error en markAllNotificacionesLeidas:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const createNotificacion = async (req, res) => {
    try {
        const { id_usuario, id_monitoria, Tipo_Notificacion, Titulo, Mensaje, Fecha_Programada } = req.body;
        
        await pool.query(
            'INSERT INTO Notificacion (id_usuario, id_monitoria, Tipo_Notificacion, Titulo, Mensaje, Fecha_Programada) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuario, id_monitoria, Tipo_Notificacion, Titulo, Mensaje, Fecha_Programada]
        );
        
        res.json({ message: 'Notificación creada exitosamente' });
    } catch (error) {
        console.error('Error en createNotificacion:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
