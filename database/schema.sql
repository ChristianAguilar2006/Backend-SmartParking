CREATE DATABASE IF NOT EXISTS smartparking;
USE smartparking;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL DEFAULT 2,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS parqueaderos (
    id_parqueadero INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    zona VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado ENUM('libre', 'ocupado', 'reservado', 'mantenimiento', 'bloqueado') NOT NULL DEFAULT 'libre',
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_parqueadero INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'activa',
    FOREIGN KEY (id_parqueadero) REFERENCES parqueaderos(id_parqueadero),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reserva INT NULL,
    id_parqueadero INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_parqueadero) REFERENCES parqueaderos(id_parqueadero)
);

CREATE TABLE IF NOT EXISTS logs (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_parqueadero INT NOT NULL,
    id_usuario INT NOT NULL,
    placa VARCHAR(20) NOT NULL,
    hora_entrada DATETIME NOT NULL,
    hora_salida DATETIME NULL,
    tipo_registro VARCHAR(50) NOT NULL,
    duracion_minutos INT NULL,
    FOREIGN KEY (id_parqueadero) REFERENCES parqueaderos(id_parqueadero),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
