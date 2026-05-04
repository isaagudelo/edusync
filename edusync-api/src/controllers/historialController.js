import pool from '../config/db.js';

export const getHistorialMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        
        const [rows] = await pool.query(
            `SELECT h.*, u.Nombre as NombreUsuario
             FROM Historial_Monitoria h
             JOIN Usuario u ON h.id_usuario_modifico = u.id_usuario
             WHERE h.id_monitoria = ?
             ORDER BY h.Fecha_Modificacion DESC`,
            [id_monitoria]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getHistorialMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getHistorialEstudiante = async (req, res) => {
    try {
        const { id_estudiante } = req.params;
        
        const [rows] = await pool.query(
            `SELECT m.*, mat.Nombre as Materia, u.Nombre as NombreMonitor,
                    am.id_monitor, d.Fecha, d.Hora_inicio, d.Hora_fin
             FROM Monitoria m
             JOIN Asignacion_Monitor am ON m.id_asignacion = am.id_asignacion
             JOIN Materia mat ON am.id_materia = mat.id_materia
             JOIN Usuario u ON am.id_monitor = u.id_usuario
             JOIN Disponibilidad d ON m.id_disponibilidad = d.id_disponibilidad
             WHERE m.id_estudiante = ?
             ORDER BY d.Fecha DESC, d.Hora_inicio DESC`,
            [id_estudiante]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getHistorialEstudiante:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const modificarFechaMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        const { nueva_fecha, nueva_hora_inicio, nueva_hora_fin } = req.body;
        const userId = req.user.id_usuario;
        
        // Verificar permisos y obtener datos actuales
        const [monitoria] = await pool.query(
            `SELECT m.*, d.Fecha, d.Hora_inicio, d.Hora_fin
             FROM Monitoria m
             JOIN Disponibilidad d ON m.id_disponibilidad = d.id_disponibilidad
             WHERE m.id_monitoria = ? AND 
             (m.id_estudiante = ? OR m.id_asignacion IN (
                SELECT id_asignacion FROM Asignacion_Monitor WHERE id_monitor = ?
             ))`,
            [id_monitoria, userId, userId]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No tienes permisos para modificar esta monitoría' });
        }
        
        const monitoriaActual = monitoria[0];
        
        // Registrar en historial
        await pool.query(
            `INSERT INTO Historial_Monitoria 
             (id_monitoria, id_usuario_modifico, Tipo_Modificacion, Valor_Anterior, Valor_Nuevo)
             VALUES (?, ?, 'Modificacion_Fecha', ?, ?)`,
            [
                id_monitoria, 
                userId, 
                `${monitoriaActual.Fecha} ${monitoriaActual.Hora_inicio}-${monitoriaActual.Hora_fin}`,
                `${nueva_fecha} ${nueva_hora_inicio}-${nueva_hora_fin}`
            ]
        );
        
        // Actualizar disponibilidad
        await pool.query(
            'UPDATE Disponibilidad SET Fecha = ?, Hora_inicio = ?, Hora_fin = ? WHERE id_disponibilidad = ?',
            [nueva_fecha, nueva_hora_inicio, nueva_hora_fin, monitoriaActual.id_disponibilidad]
        );
        
        res.json({ message: 'Fecha de monitoría modificada exitosamente' });
    } catch (error) {
        console.error('Error en modificarFechaMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
