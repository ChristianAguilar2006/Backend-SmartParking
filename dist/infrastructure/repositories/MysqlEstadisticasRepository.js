"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlEstadisticasRepository = void 0;
const IEstadisticasRepository_1 = require("../../domain/repositories/IEstadisticasRepository");
const mysql_connection_1 = require("./database/mysql.connection");
const AVLEstadisticas_1 = require("./AVLEstadisticas");
const log_1 = require("../../domain/entities/log");
class MysqlEstadisticasRepository extends IEstadisticasRepository_1.IEstadisticasRepository {
    constructor() {
        super(...arguments);
        this.avl = new AVLEstadisticas_1.AVLEstadisticas();
        this.hashMap = new Map();
        this.seriesTiempo = [];
    }
    async ocupacionPromedio() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT AVG(duracion_minutos) as promedio FROM logs WHERE hora_salida IS NOT NULL');
        return rows[0].promedio ?? 0;
    }
    async horasPico() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT HOUR(hora_entrada) as hora, COUNT(*) as cantidad FROM logs GROUP BY HOUR(hora_entrada) ORDER BY cantidad DESC');
        rows.forEach((fila) => {
            this.hashMap.set(`hora_${fila.hora}`, fila.cantidad);
            this.seriesTiempo.push({ fecha: new Date(), cantidad: fila.cantidad });
        });
        return rows.map((fila) => ({ hora: fila.hora, cantidad: fila.cantidad }));
    }
    async tiempoPromedioEstadia() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT AVG(duracion_minutos) as promedio FROM logs WHERE duracion_minutos IS NOT NULL');
        return rows[0].promedio ?? 0;
    }
    async parqueaderosMasReservados() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT id_parqueadero, COUNT(*) as cantidad FROM reservas GROUP BY id_parqueadero ORDER BY cantidad DESC');
        rows.forEach((fila) => {
            this.hashMap.set(`parqueadero_${fila.id_parqueadero}`, fila.cantidad);
        });
        return rows.map((fila) => ({ idParqueadero: fila.id_parqueadero, cantidad: fila.cantidad }));
    }
    async reservasPorUsuario(idUsuario) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT COUNT(*) as cantidad FROM reservas WHERE id_usuario = ?', [idUsuario]);
        return rows[0].cantidad ?? 0;
    }
    async ingresosTotales() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT SUM(monto) as total FROM pagos WHERE estado = ?', ['confirmado']);
        return rows[0].total ?? 0;
    }
    async metodoPagoMasUsado() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT metodo, COUNT(*) as cantidad FROM pagos GROUP BY metodo ORDER BY cantidad DESC LIMIT 1');
        const metodo = rows[0]?.metodo ?? 'ninguno';
        this.hashMap.set('metodo_mas_usado', 1);
        return metodo;
    }
    async buscarPorRango(inicio, fin) {
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM logs WHERE hora_entrada BETWEEN ? AND ?', [inicio, fin]);
        rows.forEach((fila) => {
            const log = new log_1.Log(fila.id_parqueadero, fila.id_usuario, fila.placa, fila.hora_entrada, fila.tipo_registro);
            this.avl.agregar(log);
        });
        return this.avl.buscarPorRango(inicio, fin);
    }
    obtenerSeriesTiempo() {
        return this.seriesTiempo;
    }
}
exports.MysqlEstadisticasRepository = MysqlEstadisticasRepository;
