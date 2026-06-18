"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPagoRepository = void 0;
const IPagoRepository_1 = require("../../domain/repositories/IPagoRepository");
const pago_1 = require("../../domain/entities/pago");
const mysql_connection_1 = require("./database/mysql.connection");
class MysqlPagoRepository extends IPagoRepository_1.IPagoRepository {
    constructor() {
        super(...arguments);
        this.colaFIFO = [];
        this.hashMap = new Map();
        this.logsPagos = [];
    }
    async guardar(pago) {
        const [result] = await mysql_connection_1.pool.execute('INSERT INTO pagos (id_usuario, id_reserva, id_parqueadero, monto, metodo, estado) VALUES (?, ?, ?, ?, ?, ?)', [pago.idUsuario, pago.idReserva ?? null, pago.idParqueadero, pago.monto, pago.metodo, pago.estado]);
        pago.idPago = result.insertId;
        this.colaFIFO.push(pago);
        this.hashMap.set(pago.idPago, pago);
        this.logsPagos.push(pago);
    }
    async buscarPorUsuario(idUsuario) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM pagos WHERE id_usuario = ?', [idUsuario]);
        return rows.map((fila) => {
            const pago = new pago_1.Pago(fila.id_usuario, fila.id_parqueadero, fila.monto, fila.metodo);
            pago.idPago = fila.id_pago;
            pago.idReserva = fila.id_reserva;
            pago.estado = fila.estado;
            return pago;
        });
    }
    async confirmarPago(idPago) {
        await mysql_connection_1.pool.execute('UPDATE pagos SET estado = ? WHERE id_pago = ?', ['confirmado', idPago]);
        const pago = this.hashMap.get(idPago);
        if (pago) {
            pago.estado = 'confirmado';
            this.hashMap.set(idPago, pago);
        }
        this.colaFIFO.shift();
    }
    async rechazarPago(idPago) {
        await mysql_connection_1.pool.execute('UPDATE pagos SET estado = ? WHERE id_pago = ?', ['fallido', idPago]);
        const pago = this.hashMap.get(idPago);
        if (pago) {
            pago.estado = 'fallido';
            this.hashMap.set(idPago, pago);
        }
        this.colaFIFO.shift();
    }
    obtenerLogs() {
        return this.logsPagos;
    }
}
exports.MysqlPagoRepository = MysqlPagoRepository;
