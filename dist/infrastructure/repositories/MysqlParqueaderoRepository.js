"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlParqueaderoRepository = void 0;
const IParqueaderoRepository_1 = require("../../domain/repositories/IParqueaderoRepository");
const parqueadero_1 = require("../../domain/entities/parqueadero");
const mysql_connection_1 = require("./database/mysql.connection");
const MinHeap_1 = require("./MinHeap");
const Matriz2D_1 = require("./Matriz2D");
class MysqlParqueaderoRepository extends IParqueaderoRepository_1.IParqueaderoRepository {
    constructor() {
        super(...arguments);
        this.heap = new MinHeap_1.MinHeap();
        this.matriz = new Matriz2D_1.Matriz2D(10, 10);
        this.hashMap = new Map(); // ← nuevo
    }
    async guardar(parqueadero) {
        await mysql_connection_1.pool.execute('INSERT INTO parqueaderos (codigo, zona, tipo, estado) VALUES (?, ?, ?, ?)', [parqueadero.codigo, parqueadero.zona, parqueadero.tipo, parqueadero.estado]);
        if (parqueadero.estado === 'libre') {
            this.heap.insertar(parqueadero);
        }
        this.hashMap.set(parqueadero.idParqueadero, parqueadero); // ← nuevo
        const fila = Math.floor((parqueadero.idParqueadero - 1) / 10);
        const columna = (parqueadero.idParqueadero - 1) % 10;
        this.matriz.actualizar(fila, columna, parqueadero.estado);
    }
    async buscarPorId(id) {
        if (this.hashMap.has(id))
            return this.hashMap.get(id); // ← O(1) desde memoria
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM parqueaderos WHERE id_parqueadero = ?', [id]);
        if (rows.length === 0)
            return null;
        const fila = rows[0];
        const parqueadero = new parqueadero_1.Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
        parqueadero.idParqueadero = fila.id_parqueadero;
        this.hashMap.set(id, parqueadero); // ← guarda en cache
        return parqueadero;
    }
    async buscarLibres() {
        this.heap = new MinHeap_1.MinHeap();
        const [rows] = await mysql_connection_1.pool.execute('SELECT * FROM parqueaderos WHERE estado = ? AND activo = TRUE', ['libre']);
        return rows.map((fila) => {
            const parqueadero = new parqueadero_1.Parqueadero(fila.codigo, fila.zona, fila.tipo, fila.estado);
            parqueadero.idParqueadero = fila.id_parqueadero;
            this.heap.insertar(parqueadero);
            this.hashMap.set(parqueadero.idParqueadero, parqueadero);
            return parqueadero;
        });
    }
    async obtenerEspacioOptimo(tipo) {
        const libres = await this.buscarLibres();
        const delTipo = libres.filter((p) => p.tipo === tipo);
        if (delTipo.length === 0) {
            throw new Error('No hay espacios disponibles para ese tipo de vehículo');
        }
        this.heap = new MinHeap_1.MinHeap();
        delTipo.forEach((p) => this.heap.insertar(p));
        const optimo = this.heap.extraerMin();
        if (!optimo) {
            throw new Error('No hay espacios disponibles para ese tipo de vehículo');
        }
        return optimo;
    }
    async cambiarEstado(id, estado) {
        await mysql_connection_1.pool.execute('UPDATE parqueaderos SET estado = ? WHERE id_parqueadero = ?', [estado, id]);
        if (estado === 'ocupado') {
            this.heap.extraerMin();
        }
        const parqueadero = this.hashMap.get(id);
        if (parqueadero) {
            parqueadero.estado = estado;
            this.hashMap.set(id, parqueadero);
        }
        const fila = Math.floor((id - 1) / 10);
        const columna = (id - 1) % 10;
        this.matriz.actualizar(fila, columna, estado);
    }
    obtenerMatriz() {
        return this.matriz.obtenerTodo();
    }
    async cargarMatrizDesdeBD() {
        const [rows] = await mysql_connection_1.pool.execute('SELECT id_parqueadero, estado FROM parqueaderos WHERE activo = TRUE');
        if (rows.length === 0) {
            return [];
        }
        this.matriz = new Matriz2D_1.Matriz2D(10, 10);
        for (const fila of rows) {
            const id = fila.id_parqueadero;
            const filaIdx = Math.floor((id - 1) / 10);
            const colIdx = (id - 1) % 10;
            this.matriz.actualizar(filaIdx, colIdx, fila.estado);
        }
        return this.matriz.obtenerTodo();
    }
    actualizarMatriz(fila, columna, estado) {
        this.matriz.actualizar(fila, columna, estado);
    }
}
exports.MysqlParqueaderoRepository = MysqlParqueaderoRepository;
