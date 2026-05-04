import pool from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id_usuario;
        const [rows] = await pool.query(
            `SELECT id_usuario, Nombre, Apellidos, Correo, Tipo_Usuario, Programa, 
                    Foto_Perfil, Biografia, Telefono, Fecha_Creacion 
             FROM Usuario WHERE id_usuario = ?`,
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id_usuario;
        const { Nombre, Apellidos, Biografia, Telefono, Programa } = req.body;
        
        await pool.query(
            `UPDATE Usuario SET 
                Nombre = ?, Apellidos = ?, Biografia = ?, 
                Telefono = ?, Programa = ?, Fecha_Actualizacion = NOW()
             WHERE id_usuario = ?`,
            [Nombre, Apellidos, Biografia, Telefono, Programa, userId]
        );
        
        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id_usuario;
        const { Foto_Perfil } = req.body;
        
        await pool.query(
            'UPDATE Usuario SET Foto_Perfil = ?, Fecha_Actualizacion = NOW() WHERE id_usuario = ?',
            [Foto_Perfil, userId]
        );
        
        res.json({ message: 'Foto de perfil actualizada exitosamente' });
    } catch (error) {
        console.error('Error en uploadProfilePicture:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
