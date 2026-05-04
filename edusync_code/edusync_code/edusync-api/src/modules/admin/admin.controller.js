import pool from '../../config/db.js';

export const createMateria = async (req, res) => {
  const { Nombre, Codigo } = req.body;
  try {
    if (!Nombre || !Codigo) {
      return res.status(400).json({ error: 'Nombre y Código son obligatorios' });
    }
    await pool.query(
      'INSERT INTO Materia (Nombre, Codigo) VALUES (?, ?)',
      [Nombre, Codigo]
    );
    res.status(201).json({ mensaje: 'Materia creada' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El código de materia ya existe' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, Nombre, Apellidos, Correo, Tipo_Usuario, Programa, Estado_Cuenta FROM Usuario'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const asignarMateria = async (req, res) => {
  const { id_monitor, id_materia } = req.body;
  try {
    if (!id_monitor || !id_materia) {
      return res.status(400).json({ error: 'Monitor y Materia son obligatorios' });
    }
    const [existing] = await pool.query(
      'SELECT * FROM Asignacion_Monitor WHERE id_monitor = ? AND id_materia = ? AND estado = "Activo"',
      [id_monitor, id_materia]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El monitor ya tiene asignada esta materia' });
    }
    await pool.query(
      'INSERT INTO Asignacion_Monitor (id_monitor, id_materia, fecha_asignacion, estado) VALUES (?, ?, CURDATE(), "Activo")',
      [id_monitor, id_materia]
    );
    res.status(201).json({ mensaje: 'Materia asignada al monitor' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAsignaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT am.id_asignacion, am.id_monitor, am.id_materia, am.fecha_asignacion, am.estado,
              u.Nombre as NombreMonitor, u.Apellidos as ApellidosMonitor,
              m.Nombre as NombreMateria, m.Codigo as CodigoMateria
       FROM Asignacion_Monitor am
       JOIN Usuario u ON am.id_monitor = u.id_usuario
       JOIN Materia m ON am.id_materia = m.id_materia
       ORDER BY am.fecha_asignacion DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAsignacion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE Asignacion_Monitor SET estado = "Inactivo" WHERE id_asignacion = ?',
      [id]
    );
    res.json({ mensaje: 'Asignación desactivada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { Estado_Cuenta } = req.body;
  try {
    await pool.query(
      'UPDATE Usuario SET Estado_Cuenta = ? WHERE id_usuario = ?',
      [Estado_Cuenta, id]
    );
    res.json({ mensaje: 'Estado de cuenta actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
