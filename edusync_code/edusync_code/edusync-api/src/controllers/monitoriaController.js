import pool from '../config/db.js';

// RF-05: Ver monitores disponibles
export const getMonitoresDisponibles = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                d.id_disponibilidad,
                u.Nombre AS Monitor,
                m.Nombre AS Materia,
                d.Fecha,
                d.Hora_inicio,
                d.Hora_fin,
                am.id_asignacion
            FROM Disponibilidad d
            JOIN Usuario u ON d.id_monitor = u.id_usuario
            JOIN Asignacion_Monitor am ON u.id_usuario = am.id_monitor
            JOIN Materia m ON am.id_materia = m.id_materia
            WHERE d.Estado = 'Disponible' AND am.estado = 'Activo'
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener citas de un estudiante específico
export const getCitasEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT m.id_monitoria, u.Nombre as NombreMonitor, mat.Nombre as Materia, d.Fecha, d.Hora_inicio as Hora
            FROM Monitoria m
            JOIN Disponibilidad d ON m.id_disponibilidad = d.id_disponibilidad
            JOIN Asignacion_Monitor am ON m.id_asignacion = am.id_asignacion
            JOIN Usuario u ON am.id_monitor = u.id_usuario
            JOIN Materia mat ON am.id_materia = mat.id_materia
            WHERE m.id_estudiante = ?
        `, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancelar monitoría (RF-06)
export const cancelarMonitoria = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtenemos la disponibilidad para liberarla antes de borrar la monitoria
        const [monitoria] = await pool.query('SELECT id_disponibilidad FROM Monitoria WHERE id_monitoria = ?', [id]);
        if (monitoria.length > 0) {
            await pool.query('UPDATE Disponibilidad SET Estado = "Disponible" WHERE id_disponibilidad = ?', [monitoria[0].id_disponibilidad]);
            await pool.query('DELETE FROM Monitoria WHERE id_monitoria = ?', [id]);
        }
        res.json({ mensaje: 'Monitoría cancelada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// RF-06: Agendar monitoria
export const agendarMonitoria = async (req, res) => {
    const { id_estudiante, id_asignacion, id_disponibilidad } = req.body;
    try {
        // 1. Crear la monitoria
        await pool.query(
            'INSERT INTO Monitoria (id_estudiante, id_asignacion, id_disponibilidad, Estado) VALUES (?, ?, ?, "Confirmada")',
            [id_estudiante, id_asignacion, id_disponibilidad]
        );
        // 2. Marcar la disponibilidad como Ocupada
        await pool.query('UPDATE Disponibilidad SET Estado = "Ocupada" WHERE id_disponibilidad = ?', [id_disponibilidad]);

        res.status(201).json({ mensaje: 'Monitoría agendada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agendar' });
    }
};

export const createAvailability = async (req, res) => {
    const { id_monitor, fecha, hora_inicio, hora_fin } = req.body;
    try {
        await pool.query(
            'INSERT INTO Disponibilidad (id_monitor, Fecha, Hora_inicio, Hora_fin, Estado) VALUES (?, ?, ?, ?, "Disponible")',
            [id_monitor, fecha, hora_inicio, hora_fin]
        );
        res.status(201).json({ mensaje: 'Disponibilidad creada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las materias para llenar un select
export const getMaterias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Materia');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Unir Monitor con Materia
export const asignarMateria = async (req, res) => {
    const { id_monitor, id_materia } = req.body;
    try {
        await pool.query(
            'INSERT INTO Asignacion_Monitor (id_monitor, id_materia, fecha_asignacion, estado) VALUES (?, ?, CURDATE(), "Activo")',
            [id_monitor, id_materia]
        );
        res.json({ mensaje: 'Materia asignada al monitor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};