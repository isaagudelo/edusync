import pool from '../config/db.js';

// En tu controlador de administrador/materias
export const createMateria = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        await pool.query(
            'INSERT INTO Materia (Nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        res.status(201).json({ mensaje: 'Materia creada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Para el Administrador
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_usuario, Nombre, Correo, Tipo_Usuario, Programa FROM Usuario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};