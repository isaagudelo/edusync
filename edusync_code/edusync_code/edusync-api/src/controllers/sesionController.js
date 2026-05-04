import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const createSesionSegura = async (req, res) => {
    try {
        const { id_monitoria } = req.body;
        const userId = req.user.id_usuario;
        
        // Verificar que el usuario pueda crear sesión para esta monitoría
        const [monitoria] = await pool.query(
            'SELECT * FROM Monitoria WHERE id_monitoria = ? AND (id_estudiante = ? OR id_asignacion IN (SELECT id_asignacion FROM Asignacion_Monitor WHERE id_monitor = ?))',
            [id_monitoria, userId, userId]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No puedes crear sesión para esta monitoría' });
        }
        
        // Generar token y clave de encriptación
        const token_sesion = uuidv4();
        const enlace_sesion = `https://meet.edusync.com/${token_sesion}`;
        const clave_encryption = crypto.randomBytes(32).toString('hex');
        
        // Calcular fecha de expiración (24 horas después de la monitoría)
        const fecha_expiracion = new Date(monitoria[0].Fecha);
        fecha_expiracion.setHours(fecha_expiracion.getHours() + 24);
        
        await pool.query(
            'INSERT INTO Sesion_Segura (id_monitoria, Token_Sesion, Enlace_Sesion, Clave_Encryption, Fecha_Expiracion) VALUES (?, ?, ?, ?, ?)',
            [id_monitoria, token_sesion, enlace_sesion, clave_encryption, fecha_expiracion]
        );
        
        res.json({ 
            message: 'Sesion segura creada exitosamente',
            enlace_sesion,
            token_sesion
        });
    } catch (error) {
        console.error('Error en createSesionSegura:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const getSesionMonitoria = async (req, res) => {
    try {
        const { id_monitoria } = req.params;
        const userId = req.user.id_usuario;
        
        // Verificar acceso
        const [monitoria] = await pool.query(
            'SELECT * FROM Monitoria WHERE id_monitoria = ? AND (id_estudiante = ? OR id_asignacion IN (SELECT id_asignacion FROM Asignacion_Monitor WHERE id_monitor = ?))',
            [id_monitoria, userId, userId]
        );
        
        if (monitoria.length === 0) {
            return res.status(403).json({ error: 'No tienes acceso a esta monitoría' });
        }
        
        const [sesion] = await pool.query(
            'SELECT * FROM Sesion_Segura WHERE id_monitoria = ? AND Activa = TRUE',
            [id_monitoria]
        );
        
        if (sesion.length === 0) {
            return res.status(404).json({ error: 'No hay sesión activa para esta monitoría' });
        }
        
        // No devolver la clave de encriptación al cliente
        const { Clave_Encryption, ...sesionSinClave } = sesion[0];
        
        res.json(sesionSinClave);
    } catch (error) {
        console.error('Error en getSesionMonitoria:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const validateTokenSesion = async (req, res) => {
    try {
        const { token_sesion } = req.body;
        
        const [sesion] = await pool.query(
            `SELECT s.*, m.id_estudiante, am.id_monitor
             FROM Sesion_Segura s
             JOIN Monitoria m ON s.id_monitoria = m.id_monitoria
             JOIN Asignacion_Monitor am ON m.id_asignacion = am.id_asignacion
             WHERE s.Token_Sesion = ? AND s.Activa = TRUE AND s.Fecha_Expiracion > NOW()`,
            [token_sesion]
        );
        
        if (sesion.length === 0) {
            return res.status(404).json({ error: 'Token inválido o expirado' });
        }
        
        res.json({ 
            valid: true,
            id_monitoria: sesion[0].id_monitoria,
            enlace_sesion: sesion[0].Enlace_Sesion
        });
    } catch (error) {
        console.error('Error en validateTokenSesion:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
