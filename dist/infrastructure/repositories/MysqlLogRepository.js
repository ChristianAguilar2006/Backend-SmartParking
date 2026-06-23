"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlLogRepository = void 0;
// infrastructure/repositories/MysqlLogRepository.ts
const ILogRepository_1 = require("../../domain/repositories/ILogRepository");
const log_1 = require("../../domain/entities/log");
const mysql_connection_1 = require("./database/mysql.connection");
class MysqlLogRepository extends ILogRepository_1.ILogRepository {
    constructor() {
        super(...arguments);
        this.colaFIFO = [];
        this.hashMap = new Map();
        this.logsPagos = [];
    }
    async guardar(log) {
        await mysql_connection_1.pool.execute('INSERT INTO logs (id_parqueadero, id_usuario, placa, hora_entrada, tipo_registro) VALUES (?, ?, ?, ?, ?)', [log.idParqueadero, log.idUsuario, log.placa, log.horaEntrada, log.tipoRegistro]);
        this.colaFIFO.push(log);
        const existentes = this.hashMap.get(log.idParqueadero) ?? [];
        existentes.push(log);
        this.hashMap.set(log.idParqueadero, existentes);
    }
    async buscarPorPlaca(placa) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM logs WHERE placa = ?', [placa]);
        return rows.map((fila) => {
            const log = new log_1.Log(fila.id_parqueadero, fila.id_usuario, fila.placa, fila.hora_entrada, fila.tipo_registro);
            log.idLog = fila.id_log;
            log.horaSalida = fila.hora_salida;
            return log;
        });
    }
    async buscarPorParqueadero(idParqueadero) {
        return this.hashMap.get(idParqueadero) ?? [];
    }
    async registrarSalida(idParqueadero, horaSalida) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT hora_entrada FROM logs WHERE id_parqueadero = ? AND hora_salida IS NULL ORDER BY hora_entrada DESC LIMIT 1', [idParqueadero]);
        if (rows.length === 0) {
            throw new Error("No hay entrada activa para este parqueadero");
        }
        const horaEntrada = new Date(rows[0].hora_entrada);
        const duracionMinutos = Math.floor((horaSalida.getTime() - horaEntrada.getTime()) / 60000);
        await mysql_connection_1.pool.execute('UPDATE logs SET hora_salida = ?, tipo_registro = ?, duracion_minutos = ? WHERE id_parqueadero = ? AND hora_salida IS NULL', [horaSalida, 'salida', duracionMinutos, idParqueadero]);
        const ultimo = this.colaFIFO.shift();
        if (ultimo) {
            ultimo.horaSalida = horaSalida;
            ultimo.tipoRegistro = 'salida';
        }
        return duracionMinutos;
    }
    obtenerColaEventos() {
        return [...this.colaFIFO];
    }
}
exports.MysqlLogRepository = MysqlLogRepository;
