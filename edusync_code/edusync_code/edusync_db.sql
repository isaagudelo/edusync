CREATE DATABASE edusync_db;
USE edusync_db;

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    Tipo_Usuario ENUM('Estudiante', 'Monitor', 'Administrador') NOT NULL,
    Programa VARCHAR(100),
    Foto_Perfil VARCHAR(255),
    Biografia TEXT,
    Telefono VARCHAR(20),
    Estado_Cuenta ENUM('Activo', 'Inactivo', 'Suspendido') DEFAULT 'Activo',
    Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Fecha_Actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Materia (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Codigo VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE Asignacion_Monitor (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NOT NULL,
    id_materia INT NOT NULL,
    fecha_asignacion DATE,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (id_monitor) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_materia) REFERENCES Materia(id_materia)
);

CREATE TABLE Disponibilidad (
    id_disponibilidad INT AUTO_INCREMENT PRIMARY KEY,
    id_monitor INT NOT NULL,
    Fecha DATE NOT NULL,
    Hora_inicio TIME NOT NULL,
    Hora_fin TIME NOT NULL,
    Estado ENUM('Disponible', 'Ocupada') DEFAULT 'Disponible',
    FOREIGN KEY (id_monitor) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Monitoria (
    id_monitoria INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT NOT NULL,
    id_asignacion INT NOT NULL,
    id_disponibilidad INT NOT NULL,
    Estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Finalizada') DEFAULT 'Pendiente',
    FOREIGN KEY (id_estudiante) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_asignacion) REFERENCES Asignacion_Monitor(id_asignacion),
    FOREIGN KEY (id_disponibilidad) REFERENCES Disponibilidad(id_disponibilidad)
);

CREATE TABLE Calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_monitoria INT NOT NULL,
    id_calificador INT NOT NULL,
    id_calificado INT NOT NULL,
    Puntuacion INT CHECK (Puntuacion BETWEEN 1 AND 5),
    Comentario TEXT,
    Fecha_Calificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria),
    FOREIGN KEY (id_calificador) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_calificado) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_monitoria INT NOT NULL,
    id_usuario INT NOT NULL,
    Contenido TEXT NOT NULL,
    Fecha_Comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estado ENUM('Activo', 'Eliminado') DEFAULT 'Activo',
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_monitoria INT NOT NULL,
    id_estudiante INT NOT NULL,
    Asistio BOOLEAN DEFAULT FALSE,
    Hora_Llegada DATETIME,
    Observaciones TEXT,
    Fecha_Registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria),
    FOREIGN KEY (id_estudiante) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_monitoria INT NULL,
    Tipo_Notificacion ENUM('Recordatorio', 'Confirmacion', 'Cancelacion', 'Calificacion', 'General') NOT NULL,
    Titulo VARCHAR(200) NOT NULL,
    Mensaje TEXT NOT NULL,
    Leida BOOLEAN DEFAULT FALSE,
    Fecha_Envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Fecha_Programada DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria)
);

CREATE TABLE Sesion_Segura (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_monitoria INT NOT NULL,
    Token_Sesion VARCHAR(255) UNIQUE NOT NULL,
    Enlace_Sesion VARCHAR(255) NOT NULL,
    Clave_Encryption VARCHAR(255) NOT NULL,
    Fecha_Creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Fecha_Expiracion DATETIME,
    Activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria)
);

CREATE TABLE Historial_Monitoria (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_monitoria INT NOT NULL,
    id_usuario_modifico INT NOT NULL,
    Tipo_Modificacion ENUM('Creacion', 'Modificacion_Fecha', 'Cancelacion', 'Confirmacion', 'Finalizacion') NOT NULL,
    Valor_Anterior TEXT,
    Valor_Nuevo TEXT,
    Fecha_Modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria),
    FOREIGN KEY (id_usuario_modifico) REFERENCES Usuario(id_usuario)
);

CREATE INDEX idx_monitoria_estudiante ON Monitoria(id_estudiante);
CREATE INDEX idx_monitoria_estado ON Monitoria(Estado);
CREATE INDEX idx_disponibilidad_monitor_fecha ON Disponibilidad(id_monitor, Fecha);
CREATE INDEX idx_notificacion_usuario_leida ON Notificacion(id_usuario, Leida);
CREATE INDEX idx_calificacion_calificado ON Calificacion(id_calificado);
CREATE INDEX idx_usuario_tipo ON Usuario(Tipo_Usuario);
CREATE INDEX idx_usuario_correo ON Usuario(Correo);