"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlReservaRepository = void 0;
const IReservaRepository_1 = require("../../domain/repositories/IReservaRepository");
const reserva_1 = require("../../domain/entities/reserva");
const mysql_connection_1 = require("./database/mysql.connection");
const AVLTree_1 = require("./AVLTree");
class MysqlReservaRepository extends IReservaRepository_1.IReservaRepository {
    constructor() {
        super(...arguments);
        this.avl = new AVLTree_1.AVLTree();
        this.hashMap = new Map();
        this.stack = [];
    }
    mapearFila(fila) {
        const reserva = new reserva_1.Reserva(fila.id_parqueadero, fila.id_usuario, new Date(fila.fecha), fila.hora_inicio, fila.hora_fin);
        reserva.idReserva = fila.id_reserva;
        reserva.estado = fila.estado;
        return reserva;
    }
    indexarReserva(reserva) {
        this.avl.agregar(reserva);
        const existentes = this.hashMap.get(reserva.idUsuario) ?? [];
        if (!existentes.some((r) => r.idReserva === reserva.idReserva)) {
            existentes.push(reserva);
            this.hashMap.set(reserva.idUsuario, existentes);
        }
        this.stack.push(reserva);
    }
    async cargarDesdeBD(fecha, idUsuario) {
        if (fecha) {
            const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM reservas WHERE fecha = ? AND estado != ?', [fecha.toISOString().slice(0, 10), 'cancelada']);
            rows.forEach((fila) => this.indexarReserva(this.mapearFila(fila)));
            return;
        }
        if (idUsuario !== undefined) {
            const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM reservas WHERE id_usuario = ?', [idUsuario]);
            rows.forEach((fila) => this.indexarReserva(this.mapearFila(fila)));
        }
    }
    async guardar(reserva) {
        const [result] = await mysql_connection_1.pool.execute('INSERT INTO reservas (id_parqueadero, id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)', [reserva.idParqueadero, reserva.idUsuario, reserva.fecha, reserva.horaInicio, reserva.horaFin, reserva.estado]);
        reserva.idReserva = result.insertId;
        this.indexarReserva(reserva);
    }
    async buscarPorFecha(fecha) {
        await this.cargarDesdeBD(fecha);
        return this.avl.buscarPorFecha(fecha);
    }
    async buscarPorIdUsuario(idUsuario) {
        if (!this.hashMap.has(idUsuario)) {
            await this.cargarDesdeBD(undefined, idUsuario);
        }
        return this.hashMap.get(idUsuario) ?? [];
    }
    async cancelar(idReserva) {
        await mysql_connection_1.pool.execute('UPDATE reservas SET estado = ? WHERE id_reserva = ?', ['cancelada', idReserva]);
        const ultima = this.stack.pop();
        if (ultima) {
            ultima.estado = 'cancelada';
        }
    }
}
exports.MysqlReservaRepository = MysqlReservaRepository;
