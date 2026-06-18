"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlReservaRepository = void 0;
const IReservaRepository_1 = require("../../domain/repositories/IReservaRepository");
const mysql_connection_1 = require("./database/mysql.connection");
const AVLTree_1 = require("./AVLTree");
class MysqlReservaRepository extends IReservaRepository_1.IReservaRepository {
    constructor() {
        super(...arguments);
        this.avl = new AVLTree_1.AVLTree();
        this.hashMap = new Map();
        this.stack = [];
    }
    async guardar(reserva) {
        await mysql_connection_1.pool.execute('INSERT INTO reservas (id_parqueadero, id_usuario, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?, ?)', [reserva.idParqueadero, reserva.idUsuario, reserva.fecha, reserva.horaInicio, reserva.horaFin, reserva.estado]);
        this.avl.agregar(reserva);
        const existentes = this.hashMap.get(reserva.idUsuario) ?? [];
        existentes.push(reserva);
        this.hashMap.set(reserva.idUsuario, existentes);
        this.stack.push(reserva);
    }
    async buscarPorFecha(fecha) {
        return this.avl.buscarPorFecha(fecha);
    }
    async buscarPorIdUsuario(idUsuario) {
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
