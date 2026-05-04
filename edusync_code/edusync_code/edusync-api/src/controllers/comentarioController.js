import pool from '../config/db.js';

export const createComentario = async (req, res) => {
    try {
        const { id_monitoria, Contenido } = req.body;
        const id_usuario = req.user.id_usuario;
        
        // Verificar que el usuario pueda comentar en esta monitoría
        const [monitoria] = await pool.query(
            'SELECT * FROM Monitoria WHERE id_monitoria = ? AND (id_estudiante = ? OR id_asignacion IN (SELECT id_asignacion FROM Asignacion_Monitor WHERE id_monitor = ?))',
            [id_monitoria, id_usuario, id_usuario]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No puedes comentar en esta monitoría' });
        }
        
        await pool.query(
            'INSERT INTO Comentario (id_monitoria, id_usuario, Contenido) VALUES (?, ?, ?)',
            [id_monitoria, id_usuario, Contenido]
        );
        
        res.json({ message: 'Comentario creado exitosamente' });
    } catch (error) {
        console.error('Error en createComentario:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getComentariosMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        
        const [rows] = await pool.query(
            `SELECT c.*, u.Nombre, u.Apellidos, u.Foto_Perfil
             FROM Comentario c
             JOIN Usuario u ON c.id_usuario = u.id_usuario
             WHERE c.id_monitoria = ? AND c.Estado = 'Activo'
             ORDER BY c.Fecha_Comentario DESC`,
            [id_monitoria]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error en getComentariosMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const deleteComentario = async (req, res) => {
    try {
        const { id_comentario } = req.params;
        const userId = req.user.id_usuario;
        
        // Verificar que el usuario sea dueño del comentario o admin
        const [comentario] = await pool.query(
            'SELECT * FROM Comentario WHERE id_comentario = ? AND id_usuario = ?',
            [id_comentario, userId]
        );
        
        if (comentario.length === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado o no tienes permisos' });
        }
        
        await pool.query(
            'UPDATE Comentario SET Estado = ? WHERE id_comentario = ?',
            ['Eliminado', id_comentario]
        );
        
        res.json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
        console.error('Error en deleteComentario:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
