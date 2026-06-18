USE smartparking;

-- Usuario de prueba (omitir si ya existe)
INSERT IGNORE INTO usuarios (nombre, email, password_hash, id_rol, activo)
VALUES ('Christian', 'christian@universidad.edu', 'Abc123!', 2, TRUE);

-- Limpiar parqueaderos previos (opcional, solo si quieres empezar de cero)
-- DELETE FROM pagos;
-- DELETE FROM reservas;
-- DELETE FROM logs;
-- DELETE FROM parqueaderos;

-- 40 espacios de parqueo (ocupan las primeras 4 filas de la matriz 10x10)
INSERT INTO parqueaderos (codigo, zona, tipo, estado, activo) VALUES
-- Fila 1 (IDs 1-10) - Zona A, autos
('A-01', 'Zona A', 'auto', 'libre', TRUE),
('A-02', 'Zona A', 'auto', 'libre', TRUE),
('A-03', 'Zona A', 'auto', 'libre', TRUE),
('A-04', 'Zona A', 'auto', 'ocupado', TRUE),
('A-05', 'Zona A', 'auto', 'libre', TRUE),
('A-06', 'Zona A', 'auto', 'reservado', TRUE),
('A-07', 'Zona A', 'auto', 'libre', TRUE),
('A-08', 'Zona A', 'auto', 'libre', TRUE),
('A-09', 'Zona A', 'auto', 'libre', TRUE),
('A-10', 'Zona A', 'auto', 'libre', TRUE),
-- Fila 2 (IDs 11-20) - Zona B, motos
('B-01', 'Zona B', 'moto', 'libre', TRUE),
('B-02', 'Zona B', 'moto', 'libre', TRUE),
('B-03', 'Zona B', 'moto', 'libre', TRUE),
('B-04', 'Zona B', 'moto', 'ocupado', TRUE),
('B-05', 'Zona B', 'moto', 'libre', TRUE),
('B-06', 'Zona B', 'moto', 'libre', TRUE),
('B-07', 'Zona B', 'moto', 'reservado', TRUE),
('B-08', 'Zona B', 'moto', 'libre', TRUE),
('B-09', 'Zona B', 'moto', 'libre', TRUE),
('B-10', 'Zona B', 'moto', 'libre', TRUE),
-- Fila 3 (IDs 21-30) - Zona C, bicicletas
('C-01', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-02', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-03', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-04', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-05', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-06', 'Zona C', 'bicicleta', 'ocupado', TRUE),
('C-07', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-08', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-09', 'Zona C', 'bicicleta', 'libre', TRUE),
('C-10', 'Zona C', 'bicicleta', 'libre', TRUE),
-- Fila 4 (IDs 31-40) - Zona D, discapacidad
('D-01', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-02', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-03', 'Zona D', 'discapacidad', 'reservado', TRUE),
('D-04', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-05', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-06', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-07', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-08', 'Zona D', 'discapacidad', 'ocupado', TRUE),
('D-09', 'Zona D', 'discapacidad', 'libre', TRUE),
('D-10', 'Zona D', 'discapacidad', 'libre', TRUE);

-- Verificar datos insertados
SELECT COUNT(*) AS total_parqueaderos FROM parqueaderos;
SELECT estado, COUNT(*) AS cantidad FROM parqueaderos GROUP BY estado;
SELECT codigo, zona, tipo, estado FROM parqueaderos ORDER BY id_parqueadero;
