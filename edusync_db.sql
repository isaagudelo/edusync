CREATE DATABASE edusync_db;
USE edusync_db;

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL, -- Aquí guardaremos el Hash de BCrypt
    Tipo_Usuario ENUM('Estudiante', 'Monitor', 'Administrador') NOT NULL,
    Programa VARCHAR(100)
);

CREATE TABLE Materia (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Codigo VARCHAR(20) UNIQUE NOT NULL
);

-- Para simplificar, asumimos que id_docente e id_monitor referencian a id_usuario
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
    Puntuacion INT CHECK (Puntuacion BETWEEN 1 AND 5),
    Comentario TEXT,
    FOREIGN KEY (id_monitoria) REFERENCES Monitoria(id_monitoria)
);