USE smartparking;

-- =============================================
-- SmartPark - Datos de prueba (complemento)
-- Usa tus usuarios existentes:
--   1 = Christian (estudiante)
--   2 = Admin SmartPark (admin)
--   3 = Sebastian Minda (guardia)
-- =============================================

-- Activar guardia (en tu BD está activo = 0)
UPDATE usuarios SET activo = 1 WHERE id_usuario = 3;

-- Usuario docente extra (opcional)
INSERT IGNORE INTO usuarios (nombre, email, password_hash, id_rol, activo)
VALUES ('Pablo Fernandez', 'pablo@universidad.edu', 'Pablo123!', 4, TRUE);

-- Parqueaderos (solo si la tabla está vacía)
INSERT INTO parqueaderos (codigo, zona, tipo, estado, activo)
SELECT * FROM (
  SELECT 'A-01' AS codigo, 'Zona A' AS zona, 'auto' AS tipo, 'libre' AS estado, TRUE AS activo UNION ALL
  SELECT 'A-02', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-03', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-04', 'Zona A', 'auto', 'ocupado', TRUE UNION ALL
  SELECT 'A-05', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-06', 'Zona A', 'auto', 'reservado', TRUE UNION ALL
  SELECT 'A-07', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-08', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-09', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'A-10', 'Zona A', 'auto', 'libre', TRUE UNION ALL
  SELECT 'B-01', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-02', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-03', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-04', 'Zona B', 'moto', 'ocupado', TRUE UNION ALL
  SELECT 'B-05', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-06', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-07', 'Zona B', 'moto', 'reservado', TRUE UNION ALL
  SELECT 'B-08', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-09', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'B-10', 'Zona B', 'moto', 'libre', TRUE UNION ALL
  SELECT 'C-01', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-02', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-03', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-04', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-05', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-06', 'Zona C', 'bicicleta', 'ocupado', TRUE UNION ALL
  SELECT 'C-07', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-08', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-09', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'C-10', 'Zona C', 'bicicleta', 'libre', TRUE UNION ALL
  SELECT 'D-01', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-02', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-03', 'Zona D', 'discapacidad', 'reservado', TRUE UNION ALL
  SELECT 'D-04', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-05', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-06', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-07', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-08', 'Zona D', 'discapacidad', 'ocupado', TRUE UNION ALL
  SELECT 'D-09', 'Zona D', 'discapacidad', 'libre', TRUE UNION ALL
  SELECT 'D-10', 'Zona D', 'discapacidad', 'libre', TRUE
) AS nuevos
WHERE (SELECT COUNT(*) FROM parqueaderos) = 0;

-- Reservas de prueba para Christian (id_usuario = 1)
INSERT INTO reservas (id_parqueadero, id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES
(1, 1, CURDATE(), '08:00:00', '10:00:00', 'activa'),
(11, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '16:00:00', 'pendiente'),
(21, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '11:00:00', 'pendiente');

-- Pagos de prueba
INSERT INTO pagos (id_usuario, id_reserva, id_parqueadero, monto, metodo, estado) VALUES
(1, 1, 1, 2.00, 'tarjeta', 'pendiente'),
(1, NULL, 4, 3.00, 'tarjeta', 'confirmado'),
(1, NULL, 11, 1.00, 'transferencia', 'confirmado');

-- Logs para estadísticas y monitoreo
INSERT INTO logs (id_parqueadero, id_usuario, placa, hora_entrada, hora_salida, tipo_registro, duracion_minutos) VALUES
(4, 1, 'PBC-1234', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 'salida', 120),
(6, 1, 'ABC-5678', DATE_SUB(NOW(), INTERVAL 2 HOUR), NULL, 'entrada', NULL),
(14, 1, 'XYZ-9012', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), 'salida', 120),
(22, 1, 'MOT-3456', DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, 'entrada', NULL);

-- Verificar
SELECT 'usuarios' AS tabla, COUNT(*) AS total FROM usuarios
UNION ALL SELECT 'parqueaderos', COUNT(*) FROM parqueaderos
UNION ALL SELECT 'reservas', COUNT(*) FROM reservas
UNION ALL SELECT 'pagos', COUNT(*) FROM pagos
UNION ALL SELECT 'logs', COUNT(*) FROM logs;

SELECT id_usuario, nombre, email, id_rol, activo FROM usuarios;
SELECT codigo, zona, tipo, estado FROM parqueaderos LIMIT 10;
