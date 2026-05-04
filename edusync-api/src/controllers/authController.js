import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { nombre, apellidos, correo, contrasena, tipo_usuario, programa } = req.body;
    try {
        if (!apellidos) {
            return res.status(400).json({ error: 'El campo apellidos es obligatorio' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);
        const [result] = await pool.query(
            'INSERT INTO Usuario (Nombre, Apellidos, Correo, Contrasena, Tipo_Usuario, Programa) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellidos, correo, hashedPassword, tipo_usuario, programa]
        );
        res.status(201).json({ mensaje: 'Usuario registrado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE Correo = ?', [correo]);
        if (rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const validPass = await bcrypt.compare(contrasena, rows[0].Contrasena);
        if (!validPass) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const tokenPayload = {
            id_usuario: rows[0].id_usuario,
            tipo_usuario: rows[0].Tipo_Usuario
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, usuario: { id: rows[0].id_usuario, nombre: rows[0].Nombre, rol: rows[0].Tipo_Usuario } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const { nombre, correo, programa } = req.body;
    const { id } = req.params;
    try {
        await pool.query(
            `UPDATE Usuario SET 
             Nombre = ?, 
             Correo = ?, 
             Programa = IFNULL(?, Programa) 
             WHERE id_usuario = ?`,
            [nombre, correo, programa, id]
        );
        res.json({ mensaje: 'Perfil actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};